package com.freelancex.model;

public class AssignFreelancerRequest {
    private int projectId;
    private int freelancerId;
    private String freelancerWallet;
    private String escrowAddress;

    // getters and setters
    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }
    public int getFreelancerId() { return freelancerId; }
    public void setFreelancerId(int freelancerId) { this.freelancerId = freelancerId; }
    public String getFreelancerWallet() { return freelancerWallet; }
    public void setFreelancerWallet(String freelancerWallet) { this.freelancerWallet = freelancerWallet; }
    public String getEscrowAddress() { return escrowAddress; }
    public void setEscrowAddress(String escrowAddress) { this.escrowAddress = escrowAddress; }
}