package com.example.ecom.controller;

import com.example.ecom.dto.CheckoutRequest;
import com.example.ecom.dto.OrderDto;
import com.example.ecom.entity.User;
import com.example.ecom.service.OrderService;
import com.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            OrderDto order = orderService.checkout(user, request.getAddressId());
            return ResponseEntity.ok(order);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<OrderDto> history = orderService.getUserOrderHistory(user.getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            OrderDto order = orderService.getOrderDetails(id, user);
            return ResponseEntity.ok(order);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
