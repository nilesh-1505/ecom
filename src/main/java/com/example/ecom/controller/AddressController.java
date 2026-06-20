package com.example.ecom.controller;

import com.example.ecom.dto.AddressDto;
import com.example.ecom.entity.Address;
import com.example.ecom.entity.User;
import com.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private UserService userService;

    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<AddressDto> addressDtos = userService.getUserAddresses(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(addressDtos);
    }

    @PostMapping
    public ResponseEntity<AddressDto> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddressDto addressDto) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Address address = Address.builder()
                .street(addressDto.getStreet())
                .city(addressDto.getCity())
                .state(addressDto.getState())
                .zipCode(addressDto.getZipCode())
                .country(addressDto.getCountry())
                .build();

        Address savedAddress = userService.addAddress(user, address);
        return ResponseEntity.ok(mapToDto(savedAddress));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody AddressDto addressDto) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            Address updatedDetails = Address.builder()
                    .street(addressDto.getStreet())
                    .city(addressDto.getCity())
                    .state(addressDto.getState())
                    .zipCode(addressDto.getZipCode())
                    .country(addressDto.getCountry())
                    .build();

            Address saved = userService.updateAddress(id, user, updatedDetails);
            return ResponseEntity.ok(mapToDto(saved));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            userService.deleteAddress(id, user);
            return ResponseEntity.ok("Address deleted successfully");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
