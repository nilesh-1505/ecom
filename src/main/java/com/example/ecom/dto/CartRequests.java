package com.example.ecom.dto;

public class CartRequests {

    public static class AddToCartRequest {
        private Long productId;
        private Integer quantity;

        public AddToCartRequest() {}
        public AddToCartRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class UpdateCartRequest {
        private Integer quantity;

        public UpdateCartRequest() {}
        public UpdateCartRequest(Integer quantity) {
            this.quantity = quantity;
        }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
