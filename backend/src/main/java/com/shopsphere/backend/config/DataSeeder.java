package com.shopsphere.backend.config;

import com.shopsphere.backend.product.Category;
import com.shopsphere.backend.product.CategoryRepository;
import com.shopsphere.backend.product.Product;
import com.shopsphere.backend.product.ProductRepository;
import com.shopsphere.backend.store.Store;
import com.shopsphere.backend.store.StoreRepository;
import com.shopsphere.backend.user.Role;
import com.shopsphere.backend.user.User;
import com.shopsphere.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final StoreRepository storeRepo;
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, StoreRepository storeRepo, CategoryRepository categoryRepo, ProductRepository productRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.storeRepo = storeRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Categories (Clean names without emojis)
        Category catElectronics = seedCategory("Electronics", "electronics", "laptop", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80");
        Category catGroceries = seedCategory("Groceries", "groceries", "shopping-bag", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80");
        Category catFashion = seedCategory("Fashion", "fashion", "tag", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80");
        Category catHome = seedCategory("Home & Kitchen", "home-kitchen", "home", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80");
        Category catHealth = seedCategory("Health & Beauty", "health-care", "heart", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80");

        // 2. Seed Users
        User admin = seedUser("Platform Admin", "admin@shopsphere.com", "Admin@123", Role.ADMIN, true, "India", "Hyderabad", "+91 98490 00001", "500081");
        User customer = seedUser("Phani", "customer@shopsphere.com", "Customer@123", Role.CUSTOMER, true, "India", "Hyderabad", "+91 98490 00002", "500081");
        seedUser("Support Agent", "support@shopsphere.com", "Support@123", Role.SUPPORT, true, "India", "Hyderabad", "+91 98490 00003", "500081");
        seedUser("Delivery Partner", "delivery@shopsphere.com", "Delivery@123", Role.DELIVERY, true, "India", "Hyderabad", "+91 98490 00004", "500081");

        User seller1 = seedUser("John Heaven", "seller@shopsphere.com", "Seller@123", Role.SELLER, true, "India", "Hyderabad", "+91 98490 12345", "500081");
        User seller2 = seedUser("Elena Vance", "elena@techhub.com", "Seller@123", Role.SELLER, true, "India", "Hyderabad", "+91 98490 34567", "500081");
        User seller3 = seedUser("Marcus Green", "marcus@greenleaf.com", "Seller@123", Role.SELLER, true, "India", "Hyderabad", "+91 98490 45678", "500033");
        User seller4 = seedUser("Sophie Laurent", "sophie@vogue.com", "Seller@123", Role.SELLER, true, "India", "Hyderabad", "+91 98490 56789", "500032");
        User pendingSeller = seedUser("Aura Vendor", "newvendor@shopsphere.com", "Seller@123", Role.SELLER, false, "India", "Hyderabad", "+91 98490 67890", "500039");

        // 3. Seed Stores located in Hyderabad regions
        Store storeHeaven = seedStore(seller1, "Heaven Store", "Premium consumer audio gear, gadgets, and specialty dark roast coffee.", "Mindspace IT Park, Hitec City", "Hyderabad", 2.3, 4.9, 342, "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200&auto=format&fit=crop&q=80", "+91 98490 12345", true, true);
        Store storePrime = seedStore(null, "Prime Supermarket", "Fresh orchard produce, artisanal bread, cold-pressed oils, and daily essentials.", "Road No. 10, Banjara Hills", "Hyderabad", 1.2, 4.8, 520, "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80", "+91 98490 23456", true, true);
        Store storeNexus = seedStore(seller2, "Nexus Tech Hub", "High-performance wireless mechanical keyboards, ergonomic mice, and GaN fast chargers.", "Cyber Towers, Madhapur", "Hyderabad", 3.5, 4.7, 189, "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80", "+91 98490 34567", true, true);
        Store storeGreen = seedStore(seller3, "Green Leaf Organics", "Pure ceremonial grade green tea, herbal skincare, and cold-pressed pure oils.", "Road No. 36, Jubilee Hills", "Hyderabad", 4.1, 4.9, 215, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80", "+91 98490 45678", true, true);
        Store storeVogue = seedStore(seller4, "Vogue Styles Studio", "Luxury heavyweight streetwear hoodies and full-grain handcrafted leather accessories.", "Financial District, Gachibowli", "Hyderabad", 2.8, 4.6, 148, "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80", "+91 98490 56789", true, true);
        Store storePending = seedStore(pendingSeller, "Aura Essentials", "Awaiting admin license verification and safety compliance clearance.", "Industrial Area, Uppal", "Hyderabad", 5.4, 4.0, 12, null, null, "+91 98490 67890", false, false);

        // 4. Seed Products with INR (₹) Prices
        seedProduct("Sony WH-1000XM5 Wireless Noise Canceling Headphones", "Industry-leading noise cancelation with dual processors and 8 microphones. 30-hour battery life with quick charge.", 26990.0, 32990.0, 20, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", "Sony", catElectronics, storeHeaven, seller1, 4.9, 89, "Delivery in 3-4 days from Heaven Store (2.3 km, Hitec City)", "APPROVED", false, null, "headphones, audio, wireless, sony");
        seedProduct("Apple AirPods Pro 2nd Generation with USB-C", "Active Noise Cancellation with Transparency mode, Personalized Spatial Audio, and MagSafe charging case.", 18990.0, 24900.0, 35, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80", "Apple", catElectronics, storeHeaven, seller1, 4.8, 142, "Delivery in 3-4 days from Heaven Store (2.3 km, Hitec City)", "APPROVED", false, null, "airpods, apple, audio, earbuds");
        seedProduct("Organic Arabica Dark Roast Whole Bean Coffee 1kg", "Single-origin high altitude roasted Arabica coffee beans with tasting notes of rich cocoa and caramel.", 899.0, 1199.0, 60, "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80", "Heaven Roasters", catGroceries, storeHeaven, seller1, 4.9, 95, "Delivery in 3-4 days from Heaven Store (2.3 km, Hitec City)", "APPROVED", false, null, "coffee, beans, dark roast, organic");
        seedProduct("Stainless Steel Double-Wall Insulated Flask 1L", "Keeps cold for 24 hours or hot for 12 hours. Matte powder-coat finish with leak-proof carry cap.", 799.0, 1299.0, 40, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80", "HydroPeak", catHome, storeHeaven, seller1, 4.7, 63, "Delivery in 3-4 days from Heaven Store (2.3 km, Hitec City)", "APPROVED", false, null, "bottle, flask, kitchen, stainless");

        seedProduct("Fresh Farm Hass Avocados (Pack of 4)", "Premium Hass avocados with rich creamy texture, harvested fresh and naturally ripened.", 299.0, 399.0, 100, "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&auto=format&fit=crop&q=80", "Prime Fresh", catGroceries, storePrime, admin, 4.8, 210, "Delivery in 2-3 days from Prime Supermarket (1.2 km, Banjara Hills)", "APPROVED", false, null, "avocado, organic, fruits, fresh");
        seedProduct("Cold-Pressed Extra Virgin Olive Oil 750ml", "First cold-pressed unfiltered olive oil from single estate groves with high natural antioxidants.", 1149.0, 1499.0, 50, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80", "Tuscan Gold", catGroceries, storePrime, admin, 4.9, 134, "Delivery in 2-3 days from Prime Supermarket (1.2 km, Banjara Hills)", "APPROVED", false, null, "olive oil, cooking, grocery, organic");
        seedProduct("Artisanal Whole Wheat Sourdough Bread Loaf", "Naturally fermented 36-hour sourdough bread baked fresh with a crisp crust and soft crumb.", 149.0, 199.0, 30, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=800&auto=format&fit=crop&q=80", "Artisan Bakery", catGroceries, storePrime, admin, 4.7, 78, "Delivery in 2-3 days from Prime Supermarket (1.2 km, Banjara Hills)", "APPROVED", false, null, "bread, sourdough, fresh bakery, food");

        seedProduct("Keychron K2 Pro Wireless Custom Mechanical Keyboard", "QMK/VIA wireless mechanical keyboard with hot-swappable switches, PBT keycaps, and RGB lighting.", 8499.0, 10999.0, 25, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80", "Keychron", catElectronics, storeNexus, seller2, 4.8, 64, "Delivery in 3-4 days from Nexus Tech Hub (3.5 km, Madhapur)", "APPROVED", false, null, "keyboard, mechanical, tech, gaming");
        seedProduct("Logitech MX Master 3S Advanced Ergonomic Wireless Mouse", "Quiet clicks with 8000 DPI sensor for high precision tracking on glass and MagSpeed electromagnetic scroll.", 7995.0, 9995.0, 40, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80", "Logitech", catElectronics, storeNexus, seller2, 4.9, 180, "Delivery in 3-4 days from Nexus Tech Hub (3.5 km, Madhapur)", "APPROVED", false, null, "mouse, logitech, ergonomic, office");
        seedProduct("Anker 65W GaN Dual USB-C Fast Charger", "High-speed compact charger for laptops, tablets, and phones with dynamic power distribution.", 2499.0, 3499.0, 50, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80", "Anker", catElectronics, storeNexus, seller2, 4.9, 92, "Delivery in 3-4 days from Nexus Tech Hub (3.5 km, Madhapur)", "APPROVED", false, null, "charger, anker, usb-c, power");

        seedProduct("Ceremonial Grade Japanese Matcha Powder 100g", "First-harvest stone-ground green tea leaves with vibrant emerald color and smooth umami taste.", 1299.0, 1699.0, 45, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80", "Uji Leaf", catHealth, storeGreen, seller3, 4.9, 110, "Delivery in 3-4 days from Green Leaf Organics (4.1 km, Jubilee Hills)", "APPROVED", false, null, "matcha, green tea, health, organic");
        seedProduct("Pure Cold-Pressed Moroccan Argan Oil 100ml", "100% pure organic virgin argan oil for deep skin nourishment and hair revitalization.", 849.0, 1199.0, 35, "https://images.unsplash.com/photo-1608248597359-009ec35e69e2?w=800&auto=format&fit=crop&q=80", "Botanicals", catHealth, storeGreen, seller3, 4.8, 77, "Delivery in 3-4 days from Green Leaf Organics (4.1 km, Jubilee Hills)", "APPROVED", false, null, "oil, skincare, argan, beauty");

        seedProduct("Heavyweight 450GSM Cotton French Terry Hoodie", "100% combed organic cotton fleece with dropped shoulders and double-stitched luxury streetwear fit.", 1999.0, 2999.0, 28, "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80", "Vogue Studio", catFashion, storeVogue, seller4, 4.7, 52, "Delivery in 3-4 days from Vogue Styles (2.8 km, Gachibowli)", "APPROVED", false, null, "hoodie, fashion, cotton, clothing");
        seedProduct("Full Grain Handcrafted Leather Slim Bifold Wallet", "Handcrafted vegetable-tanned leather wallet with 6 card slots and RFID protection.", 999.0, 1699.0, 30, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80", "Vogue Studio", catFashion, storeVogue, seller4, 4.8, 81, "Delivery in 3-4 days from Vogue Styles (2.8 km, Gachibowli)", "APPROVED", false, null, "wallet, leather, accessories, luxury");

        seedProduct("Himalayan Rose Mineral Body Soak Crystals 500g", "Hand-harvested pink salt crystals with organic rose petals and botanical essential oils.", 499.0, 699.0, 15, "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80", "Aura", catHealth, storePending, pendingSeller, 4.2, 8, "Pending store approval (5.4 km, Uppal)", "PENDING_REVIEW", false, "Awaiting initial vendor license verification", "bath salt, aura, relaxation");
        seedProduct("Herbal Euphoria Mood Booster (Restricted Compound)", "Concentrated herbal formulation containing unapproved synthetic mood compounds.", 1999.0, 2499.0, 5, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80", "Shady Labs", catHealth, storePending, pendingSeller, 3.5, 2, "Prohibited from delivery", "PENDING_REVIEW", true, "FLAGGED BY AUTOMATED SAFETY SCANNER: Restricted substance keyword detected. Requires Admin Review.", "supplement, mood, restricted, drug-compound");
    }

    private Category seedCategory(String name, String slug, String icon, String imageUrl) {
        return categoryRepo.findBySlugIgnoreCase(slug).orElseGet(() -> {
            Category c = new Category(name, slug, icon, imageUrl);
            return categoryRepo.save(c);
        });
    }

    private User seedUser(String name, String email, String password, Role role, boolean approved, String country, String city, String phone, String pincode) {
        return userRepo.findByEmailIgnoreCase(email).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email.toLowerCase());
            u.setPasswordHash(encoder.encode(password));
            u.setRole(role);
            u.setApproved(approved);
            u.setCountry(country);
            u.setCity(city);
            u.setPhone(phone);
            u.setPincode(pincode);
            return userRepo.save(u);
        });
    }

    private Store seedStore(User seller, String name, String desc, String address, String city, double distanceKm, double rating, int reviewCount, String banner, String logo, String phone, boolean verified, boolean approved) {
        return storeRepo.findByNameContainingIgnoreCase(name).stream().findFirst().orElseGet(() -> {
            Store s = new Store(seller, name, desc, address, city, distanceKm, rating, reviewCount, banner, logo, phone, verified, approved);
            return storeRepo.save(s);
        });
    }

    private Product seedProduct(String name, String desc, double price, double origPrice, int stock, String img, String brand, Category cat, Store store, User seller, double rating, int reviews, String deliveryTime, String status, boolean restricted, String notes, String tags) {
        return productRepo.findAll().stream().filter(p -> p.getName().equalsIgnoreCase(name)).findFirst().orElseGet(() -> {
            Product p = new Product(name, desc, price, origPrice, stock, img, brand, cat, store, seller, rating, reviews, deliveryTime, status, restricted, notes, tags);
            return productRepo.save(p);
        });
    }
}
