package com.freelancex.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.freelancex.model.Project;
import com.freelancex.repository.ProjectRepo;

@RequestMapping("/project")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {
    @Autowired
    private ProjectRepo repo;

    @PostMapping("/newproject")
    public Boolean newproject(@RequestBody Project project){
        repo.save(project);
        return true;
    }

    @GetMapping("/fetchallprojects")
    public List<Project> allprojects(){
        List<Project> all=repo.findAll();
        return all;
    }

    @GetMapping("/fetchopenprojects")
    public List<Project> openProjects(){
        List<Project> open = repo.openProjects();
        return open;
    }

    @GetMapping("/ownprojects") 
    public List<Project> ownprojects(@RequestParam int clientId){
        List<Project> l = repo.findByClientId(clientId);
        return l;
    }
    @GetMapping("/getProjectDetails")
    public Optional<Project> getProjectDetails(@RequestParam int projectId) {
        return repo.findById(projectId);
    }
    
    // Add/update escrow address and freelancer wallet for a project
    @PostMapping("/updateEscrow")
    public String updateEscrow(@RequestBody EscrowUpdateRequest request) {
        Optional<Project> projectOpt = repo.findById(request.getProjectId());
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            project.setEscrowAddress(request.getEscrowAddress());
            project.setFreelancerWallet(request.getFreelancerWallet());
            repo.save(project);
            return "Escrow updated successfully";
        } else {
            return "Project not found";
        }
    }
}

// DTO for updateEscrow
class EscrowUpdateRequest {
    private int projectId;
    private String escrowAddress;
    private String freelancerWallet;

    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }
    public String getEscrowAddress() { return escrowAddress; }
    public void setEscrowAddress(String escrowAddress) { this.escrowAddress = escrowAddress; }
    public String getFreelancerWallet() { return freelancerWallet; }
    public void setFreelancerWallet(String freelancerWallet) { this.freelancerWallet = freelancerWallet; }
}
