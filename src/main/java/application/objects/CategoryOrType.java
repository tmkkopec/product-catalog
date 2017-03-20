package application.objects;

import java.util.HashSet;
import java.util.Set;

public class CategoryOrType {
    private String name;
    private String typeId = null;
    private String categoryId = null;
    private boolean isCategory;
    private Set<CategoryOrType> children = null;
    private Set<String> associations = new HashSet<String>();

    public CategoryOrType(boolean isCategory) {
        this.isCategory = isCategory;
        if (isCategory) children = new HashSet<CategoryOrType>();
    }

    public Set<CategoryOrType> getChildren() {
        return children;
    }

    public void setChildren(Set<CategoryOrType> children) {
        this.children = children;
    }

    public void addChild(CategoryOrType e) {
        children.add(e);
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
        return categoryId;
    }

    public void setCategoryId(String id) {
        this.categoryId = id;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String id) {
        this.typeId = id;
    }

    public boolean isCategory() {
        return isCategory;
    }

    public void setCategory(boolean isCategory) {
        this.isCategory = isCategory;
    }

    public void removeChild(CategoryOrType child) {
        this.children.remove(child);
    }

}