package com.example.ecom.config;

import com.example.ecom.entity.*;
import com.example.ecom.repository.AddressRepository;
import com.example.ecom.repository.CategoryRepository;
import com.example.ecom.repository.ProductRepository;
import com.example.ecom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final List<String> IMAGE_POOL = List.of(
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60", // Phone
        "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&auto=format&fit=crop&q=60", // Laptop
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60", // Headphones
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", // Smart watch
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60", // Clothing
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60", // Floor lamp
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60", // Book
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60", // Audio gear
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60", // Sunglasses
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"  // Shoes
    );

    private List<String> getCategoryNames() {
        return List.of(
            // Electronics (20)
            "Smartphones", "Laptops", "Televisions", "Washing Machines", "Refrigerators", 
            "Microwaves", "Air Conditioners", "Headphones", "Speakers", "Cameras", 
            "Smartwatches", "Tablets", "Keyboards", "Mice", "Monitors", 
            "Printers", "Routers", "Power Banks", "Hard Drives", "Projectors",
            // Fashion (20)
            "Shirts", "Pants", "Sarees", "Kurtas", "T-Shirts", 
            "Jeans", "Jackets", "Sweaters", "Dresses", "Skirts", 
            "Shorts", "Socks", "Shoes", "Sandals", "Watches", 
            "Belts", "Wallets", "Handbags", "Sunglasses", "Caps",
            // Home & Kitchen (20)
            "Bed Sheets", "Curtains", "Cushions", "Carpets", "Wall Art", 
            "Clocks", "Vases", "Candles", "Dining Tables", "Chairs", 
            "Sofas", "Bookshelves", "Coffee Tables", "Wardrobes", "Beds", 
            "Mattresses", "Pillows", "Blankets", "Towels", "Kitchen Cookware",
            // Beauty & Health (20)
            "Shampoos", "Conditioners", "Face Wash", "Moisturizers", "Sunscreen", 
            "Perfumes", "Deodorants", "Lipsticks", "Nail Polish", "Foundation", 
            "Eyeliner", "Mascara", "Soaps", "Body Lotions", "Toothpastes", 
            "Hair Oils", "Serums", "Facial Kits", "Scrubs", "Hair Dryers",
            // Office & Sports (20)
            "Novels", "Textbooks", "Notebooks", "Pens", "Pencils", 
            "Art Supplies", "Office Chairs", "Desk Organizers", "Backpacks", "Travel Bags", 
            "Fitness Equipment", "Yoga Mats", "Dumbbells", "Bicycles", "Treadmills", 
            "Cricket Bats", "Football Balls", "Badminton Rackets", "Board Games", "Action Figures"
        );
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear catalog tables on startup to reseed fresh with realistic pricing
        System.out.println("Resetting database catalog tables for fresh seed data...");
        jdbcTemplate.execute("TRUNCATE TABLE cart_items, order_items, orders, products, categories RESTART IDENTITY CASCADE;");

        // Seed Users
        User admin = null;
        if (!userRepository.existsByEmail("admin@ecom.com")) {
            admin = User.builder()
                    .email("admin@ecom.com")
                    .password(passwordEncoder.encode("admin"))
                    .phoneNumber("9876543210")
                    .roles(Set.of(Role.ROLE_USER, Role.ROLE_ADMIN))
                    .build();
            admin = userRepository.save(admin);
        }

        User customer = null;
        if (!userRepository.existsByEmail("user@ecom.com")) {
            customer = User.builder()
                    .email("user@ecom.com")
                    .password(passwordEncoder.encode("user"))
                    .phoneNumber("9988776655")
                    .roles(Set.of(Role.ROLE_USER))
                    .build();
            customer = userRepository.save(customer);

            // Seed addresses for customer
            Address addr1 = Address.builder()
                    .street("123 Main Street, Apt 4B")
                    .city("New York")
                    .state("NY")
                    .zipCode("10001")
                    .country("USA")
                    .user(customer)
                    .build();
            addressRepository.save(addr1);

            Address addr2 = Address.builder()
                    .street("456 Oak Avenue")
                    .city("San Francisco")
                    .state("CA")
                    .zipCode("94103")
                    .country("USA")
                    .user(customer)
                    .build();
            addressRepository.save(addr2);
        }

        // Seed Categories (100 categories)
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding 100 categories...");
            List<String> names = getCategoryNames();
            List<Category> categoriesList = new ArrayList<>();
            for (String name : names) {
                categoriesList.add(Category.builder()
                        .name(name)
                        .description("Premium curated selection of " + name.toLowerCase())
                        .build());
            }
            categoryRepository.saveAll(categoriesList);
            System.out.println("Seeding 100 categories completed.");
        }

        // Seed Products (10,000 products: 100 products under each of the 100 categories)
        if (productRepository.count() == 0) {
            System.out.println("Seeding 10,000 products with realistic market prices...");
            List<Category> savedCategories = categoryRepository.findAll();
            List<Product> batchList = new ArrayList<>();
            
            long startTime = System.currentTimeMillis();
            int totalCounter = 0;

            for (Category cat : savedCategories) {
                for (int i = 1; i <= 100; i++) {
                    Product product = Product.builder()
                            .name(cat.getName() + " Premium " + i)
                            .description("This is a premium high-quality " + cat.getName().toLowerCase() + " Model " + i + ". Offers industry-leading features, durable components, and exceptional value. Extensively tested for quality assurance.")
                            .price(getRealisticPrice(cat.getName(), i))
                            .stock(10 + (i % 45))
                            .imageUrl(IMAGE_POOL.get(i % IMAGE_POOL.size()))
                            .category(cat)
                            .build();
                    batchList.add(product);
                    totalCounter++;

                    // Save in batches of 500 to keep memory low and take advantage of batch inserts
                    if (batchList.size() >= 500) {
                        productRepository.saveAll(batchList);
                        batchList.clear();
                    }
                }
            }
            // Save remaining products
            if (!batchList.isEmpty()) {
                productRepository.saveAll(batchList);
            }
            
            long endTime = System.currentTimeMillis();
            System.out.println("Successfully seeded " + totalCounter + " products in " + (endTime - startTime) + " ms!");
        }
    }

    private BigDecimal getRealisticPrice(String categoryName, int index) {
        double base = 299.0;
        double scale = 25.0;

        switch (categoryName) {
            case "Smartphones":
                base = 9999.0;
                scale = 1200.0;
                break;
            case "Laptops":
                base = 24999.0;
                scale = 1500.0;
                break;
            case "Televisions":
                base = 11999.0;
                scale = 900.0;
                break;
            case "Washing Machines":
                base = 10999.0;
                scale = 350.0;
                break;
            case "Refrigerators":
                base = 12999.0;
                scale = 600.0;
                break;
            case "Air Conditioners":
                base = 21999.0;
                scale = 400.0;
                break;
            case "Headphones":
            case "Speakers":
            case "Cameras":
            case "Smartwatches":
            case "Tablets":
            case "Monitors":
            case "Projectors":
                base = 1499.0;
                scale = 250.0;
                break;
            case "Keyboards":
            case "Mice":
            case "Routers":
            case "Power Banks":
            case "Hard Drives":
            case "Printers":
                base = 499.0;
                scale = 100.0;
                break;
            case "Shirts":
            case "Pants":
            case "Kurtas":
            case "T-Shirts":
            case "Jeans":
            case "Sweaters":
            case "Skirts":
            case "Shorts":
            case "Caps":
                base = 399.0;
                scale = 30.0;
                break;
            case "Sarees":
            case "Dresses":
            case "Jackets":
            case "Handbags":
            case "Watches":
            case "Shoes":
                base = 799.0;
                scale = 70.0;
                break;
            case "Socks":
            case "Belts":
            case "Wallets":
            case "Sandals":
            case "Sunglasses":
                base = 199.0;
                scale = 15.0;
                break;
            case "Dining Tables":
            case "Sofas":
            case "Beds":
            case "Wardrobes":
                base = 7999.0;
                scale = 800.0;
                break;
            case "Chairs":
            case "Bookshelves":
            case "Coffee Tables":
            case "Mattresses":
                base = 1999.0;
                scale = 150.0;
                break;
            case "Bed Sheets":
            case "Curtains":
            case "Cushions":
            case "Carpets":
            case "Wall Art":
            case "Clocks":
            case "Vases":
            case "Blankets":
            case "Towels":
            case "Kitchen Cookware":
                base = 299.0;
                scale = 20.0;
                break;
            case "Candles":
                base = 99.0;
                scale = 5.0;
                break;
            case "Shampoos":
            case "Conditioners":
            case "Face Wash":
            case "Moisturizers":
            case "Sunscreen":
            case "Perfumes":
            case "Deodorants":
            case "Lipsticks":
            case "Nail Polish":
            case "Foundation":
            case "Eyeliner":
            case "Mascara":
            case "Soaps":
            case "Body Lotions":
            case "Toothpastes":
            case "Hair Oils":
            case "Serums":
            case "Facial Kits":
            case "Scrubs":
            case "Hair Dryers":
                base = 99.0;
                scale = 12.0;
                break;
            case "Bicycles":
            case "Treadmills":
                base = 5999.0;
                scale = 500.0;
                break;
            case "Fitness Equipment":
            case "Yoga Mats":
            case "Dumbbells":
            case "Cricket Bats":
            case "Football Balls":
            case "Badminton Rackets":
                base = 299.0;
                scale = 45.0;
                break;
            case "Novels":
            case "Textbooks":
            case "Notebooks":
            case "Pens":
            case "Pencils":
            case "Art Supplies":
                base = 49.0;
                scale = 8.0;
                break;
            case "Board Games":
            case "Action Figures":
                base = 299.0;
                scale = 25.0;
                break;
            default:
                break;
        }

        double price = base + (index % 20) * scale;
        return BigDecimal.valueOf(Math.round(price) - 0.01);
    }
}
