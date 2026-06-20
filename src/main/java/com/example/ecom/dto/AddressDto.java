package com.example.ecom.dto;

public class AddressDto {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    public AddressDto() {}
    public AddressDto(Long id, String street, String city, String state, String zipCode, String country) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public static AddressDtoBuilder builder() {
        return new AddressDtoBuilder();
    }

    public static class AddressDtoBuilder {
        private Long id;
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;

        public AddressDtoBuilder id(Long id) { this.id = id; return this; }
        public AddressDtoBuilder street(String street) { this.street = street; return this; }
        public AddressDtoBuilder city(String city) { this.city = city; return this; }
        public AddressDtoBuilder state(String state) { this.state = state; return this; }
        public AddressDtoBuilder zipCode(String zipCode) { this.zipCode = zipCode; return this; }
        public AddressDtoBuilder country(String country) { this.country = country; return this; }
        public AddressDto build() {
            return new AddressDto(id, street, city, state, zipCode, country);
        }
    }
}
