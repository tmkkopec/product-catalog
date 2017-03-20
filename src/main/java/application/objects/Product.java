package application.objects;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class Product {
    private String productOfferingId;
    private String productOfferingCode;
    private boolean isBundle = false;
    private Set<Product> products = new HashSet<Product>();
    private Map<String, Object> generals = new HashMap<String, Object>();
    private Set<Transition> transitions = new HashSet<Transition>();
    private Set<Price> prices = new HashSet<Price>();

    public Product() {
    }

    public void addProduct(Product product) {
        this.products.add(product);
    }

    public void addGeneral(String key, Object value) {
        generals.put(key, value);
    }

    public void addTransition(Transition transition) {
        transitions.add(transition);
    }

    public void addPrice(Price price) {
        prices.add(price);
    }

    public Map<String, Object> getGenerals() {
        return generals;
    }

    public Set<Transition> getTransitions() {
        return transitions;
    }

    public Set<Price> getPrices() {
        return prices;
    }

    public String getProductOfferingId() {
        return this.productOfferingId;
    }

    public void setProductOfferingId(String productOfferingId) {
        this.productOfferingId = productOfferingId;
    }

    public String getProductOfferingCode() {
        return this.productOfferingCode;
    }

    public void setProductOfferingCode(String productOfferingCode) {
        this.productOfferingCode = productOfferingCode;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public boolean getIsBundle() {
        return this.isBundle;
    }

    public void setIsBundle(boolean isBundle) {
        this.isBundle = isBundle;
    }
}
