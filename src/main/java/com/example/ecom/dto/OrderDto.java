package com.example.ecom.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private AddressDto shippingAddress;
    private List<OrderItemDto> orderItems;

    public OrderDto() {}
    public OrderDto(Long id, LocalDateTime orderDate, BigDecimal totalAmount, String status, AddressDto shippingAddress, List<OrderItemDto> orderItems) {
        this.id = id;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.orderItems = orderItems;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public AddressDto getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(AddressDto shippingAddress) { this.shippingAddress = shippingAddress; }
    public List<OrderItemDto> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; }

    public static OrderDtoBuilder builder() {
        return new OrderDtoBuilder();
    }

    public static class OrderDtoBuilder {
        private Long id;
        private LocalDateTime orderDate;
        private BigDecimal totalAmount;
        private String status;
        private AddressDto shippingAddress;
        private List<OrderItemDto> orderItems;

        public OrderDtoBuilder id(Long id) { this.id = id; return this; }
        public OrderDtoBuilder orderDate(LocalDateTime orderDate) { this.orderDate = orderDate; return this; }
        public OrderDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public OrderDtoBuilder status(String status) { this.status = status; return this; }
        public OrderDtoBuilder shippingAddress(AddressDto shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public OrderDtoBuilder orderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; return this; }
        public OrderDto build() {
            return new OrderDto(id, orderDate, totalAmount, status, shippingAddress, orderItems);
        }
    }

    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private String productImageUrl;

        public OrderItemDto() {}
        public OrderItemDto(Long id, Long productId, String productName, BigDecimal price, Integer quantity, String productImageUrl) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.productImageUrl = productImageUrl;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getProductImageUrl() { return productImageUrl; }
        public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

        public static OrderItemDtoBuilder builder() {
            return new OrderItemDtoBuilder();
        }

        public static class OrderItemDtoBuilder {
            private Long id;
            private Long productId;
            private String productName;
            private BigDecimal price;
            private Integer quantity;
            private String productImageUrl;

            public OrderItemDtoBuilder id(Long id) { this.id = id; return this; }
            public OrderItemDtoBuilder productId(Long productId) { this.productId = productId; return this; }
            public OrderItemDtoBuilder productName(String productName) { this.productName = productName; return this; }
            public OrderItemDtoBuilder price(BigDecimal price) { this.price = price; return this; }
            public OrderItemDtoBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public OrderItemDtoBuilder productImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; return this; }
            public OrderItemDto build() {
                return new OrderItemDto(id, productId, productName, price, quantity, productImageUrl);
            }
        }
    }
}
