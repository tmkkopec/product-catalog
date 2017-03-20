package application.objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

/**
 * Created by tkopec on 2016-08-25.
 */
public class CategoriesToSave {
    private String name;
    private String id;
    @JsonProperty
    private boolean isCategory;
    private Set<CategoriesToSave> children;
    private Set<String> associations;

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }

    public Set<CategoriesToSave> getChildren() {
        return children;
    }

    public boolean isCategory() {
        return isCategory;
    }

    public Set<String> getAssociations() {
        return associations;
    }

    @Override
    public String toString() {
        return "CategoriesToSave{" +
                "name='" + name + '\'' +
                ", id='" + id + '\'' +
                ", isCategory=" + isCategory +
                ", children=" + children +
                '}';
    }
}
