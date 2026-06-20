package com.example.ecom.service;

import com.example.ecom.dto.AddressDto;
import com.example.ecom.dto.OrderDto;
import com.example.ecom.entity.*;
import com.example.ecom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public OrderDto checkout(User user, Long addressId) {
        // Fetch User's Cart
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot checkout: Cart is empty");
        }

        // Fetch Shipping Address
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Shipping address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized use of address");
        }

        // Calculate Totals and Validate Stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(address)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .build();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Product " + product.getName() + " has insufficient stock");
            }

            // Deduct Stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            // Compute price
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            // Create OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // Save Order (cascades save to orderItems)
        Order savedOrder = orderRepository.save(order);

        // Clear Cart
        cartItemRepository.deleteByUserId(user.getId());

        return convertToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrderHistory(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderDetails(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // If not admin, check if order belongs to the user
        boolean isAdmin = user.getRoles().contains(Role.ROLE_ADMIN);
        if (!isAdmin && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        return convertToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return convertToDto(orderRepository.save(order));
    }

    public OrderDto convertToDto(Order order) {
        List<OrderDto.OrderItemDto> items = order.getOrderItems().stream().map(item ->
                OrderDto.OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .build()
        ).collect(Collectors.toList());

        AddressDto addressDto = AddressDto.builder()
                .id(order.getShippingAddress().getId())
                .street(order.getShippingAddress().getStreet())
                .city(order.getShippingAddress().getCity())
                .state(order.getShippingAddress().getState())
                .zipCode(order.getShippingAddress().getZipCode())
                .country(order.getShippingAddress().getCountry())
                .build();

        return OrderDto.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(addressDto)
                .orderItems(items)
                .build();
    }
}
