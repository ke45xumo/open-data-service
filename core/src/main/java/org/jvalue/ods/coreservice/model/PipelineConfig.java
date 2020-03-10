package org.jvalue.ods.coreservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.jvalue.ods.coreservice.model.adapter.AdapterConfig;
import org.jvalue.ods.coreservice.model.notification.NotificationConfig;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
public class PipelineConfig implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // referenced by embedded adapter config for format and protocol
    private Long id;

    @Embedded @NotNull
    private AdapterConfig adapter;

    @ElementCollection @NotNull
    private List<TransformationConfig> transformations;

    @Embedded @NotNull
    private PipelineTriggerConfig trigger;

    @Embedded @NotNull
    private PipelineMetadata metadata;

    @OneToMany(cascade = CascadeType.ALL)
    private List<NotificationConfig> notifications;

    //Constructor for JPA
    public PipelineConfig() {}

    @JsonCreator
    public PipelineConfig(
            @JsonProperty("adapter") AdapterConfig adapter,
            @JsonProperty("transformations") List<TransformationConfig> transformations,
            @JsonProperty("trigger") PipelineTriggerConfig trigger,
            @JsonProperty("metadata") PipelineMetadata metadata,
            @JsonProperty("notifications") List<NotificationConfig> notifications) {
        this.adapter = adapter;
        this.transformations = transformations;
        this.trigger = trigger;
        this.metadata = metadata;
        this.notifications = notifications;
    }

    @Override
    public String toString() {
        return "PipelineConfig{" +
                "id=" + id +
                ", adapter=" + adapter +
                ", transformations=" + transformations.toString() +
                ", trigger=" + trigger +
                ", metadata=" + metadata +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PipelineConfig that = (PipelineConfig) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdapterConfig getAdapter() {
        return adapter;
    }

    public void setAdapter(AdapterConfig adapter) {
        this.adapter = adapter;
    }

    public List<TransformationConfig> getTransformations() {
        return transformations;
    }

    public void setTransformations(List<TransformationConfig> transformations) {
        this.transformations = transformations;
    }

    public PipelineTriggerConfig getTrigger() {
        return trigger;
    }

    public void setTrigger(PipelineTriggerConfig trigger) {
        this.trigger = trigger;
    }

    public PipelineMetadata getMetadata() {
        return metadata;
    }

    public List<NotificationConfig> getNotifications() {
        return notifications;
    }

    public void addNotification(NotificationConfig notification) {
        this.notifications.add(notification);
    }

    public void removeNotification(NotificationConfig notification) {
        this.notifications.remove(notification);
    }
 }
