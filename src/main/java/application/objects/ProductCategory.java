package application.objects;

import java.util.HashSet;
import java.util.Set;

public class ProductCategory {
    private String name;
    private String id;
    private Set<ProductType> typeSet = new HashSet<ProductType>();
    private Set<String> associations = new HashSet<String>();

    public void addChild(ProductType e) {
        typeSet.add(e);
    }

    public Set<String> getAssociations() {
        return associations;
    }

    public void setAssociations(Set<String> associations) {
        this.associations = associations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategoryId() {
        return id;
    }

    public void setCategoryId(String id) {
        this.id = id;
    }

    public Set<ProductType> getChildren() {
        return typeSet;
    }
}
