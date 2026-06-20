package com.example.ecom.controller;

import com.example.ecom.dto.CartRequests.*;
import com.example.ecom.entity.CartItem;
import com.example.ecom.entity.User;
import com.example.ecom.service.CartService;
import com.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToCartRequest request) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            CartItem item = cartService.addToCart(user, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(item);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateCartRequest request) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            CartItem item = cartService.updateCartItemQuantity(user, id, request.getQuantity());
            return ResponseEntity.ok(item);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            cartService.removeFromCart(user, id);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            cartService.clearCart(user);
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
