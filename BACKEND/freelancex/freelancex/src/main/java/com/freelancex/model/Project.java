package com.freelancex.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "client_id")
    private int clientId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "min_budget")
    private float minBudget;

    @Column(name = "max_budget")
    private float maxBudget;

    @Column(name = "status")
    private String status;

    @Column(name = "category")
    private String category;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "skills_required")
    private String skillsRequired;

    @Column(name = "escrow_amount")
    private float escrowAmount;


    @JsonProperty("escrowAddress")
    @Column(name = "escrow_address")
    private String escrowAddress;

    @JsonProperty("freelancerWallet")
    @Column(name = "freelancer_wallet")
    private String freelancerWallet;

    @JsonProperty("clientWallet")
    @Column(name = "client_wallet")
    private String clientWallet;

    @Column(name = "currency")
    private String currency;

    @Column(name = "freelancer_id")
    private Integer freelancerId; // nullable

    public Project() {}


    public String getEscrowAddress() { return escrowAddress; }
    public void setEscrowAddress(String escrowAddress) { this.escrowAddress = escrowAddress; }

    public String getFreelancerWallet() { return freelancerWallet; }
    public void setFreelancerWallet(String freelancerWallet) { this.freelancerWallet = freelancerWallet; }

    public String getClientWallet() { return clientWallet; }
    public void setClientWallet(String clientWallet) { this.clientWallet = clientWallet; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getClientId() { return clientId; }
    public void setClientId(int clientId) { this.clientId = clientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public float getMinBudget() { return minBudget; }
    public void setMinBudget(float minBudget) { this.minBudget = minBudget; }

    public float getMaxBudget() { return maxBudget; }
    public void setMaxBudget(float maxBudget) { this.maxBudget = maxBudget; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(String skillsRequired) { this.skillsRequired = skillsRequired; }

    public float getEscrowAmount() { return escrowAmount; }
    public void setEscrowAmount(float escrowAmount) { this.escrowAmount = escrowAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getFreelancerId() { return freelancerId; }
    public void setFreelancerId(Integer freelancerId) { this.freelancerId = freelancerId; }
}