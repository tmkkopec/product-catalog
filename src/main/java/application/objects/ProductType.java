package application.objects;

import java.util.HashSet;
import java.util.Set;

public class ProductType {
    private String id;
    private String name;
    private Set<String> associations = new HashSet<String>();

    public String getTypeId() {
        return id;
    }

    public void setTypeId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getAssociations() {
        return associations;
    }

    public void setAssociations(Set<String> associations) {
        this.associations = associations;
    }

}
