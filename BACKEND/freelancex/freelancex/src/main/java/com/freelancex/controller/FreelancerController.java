package com.freelancex.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.freelancex.model.Freelancer;
import com.freelancex.repository.FreelancerRepo;


@RequestMapping("/freelancer")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FreelancerController {
    
    @Autowired
    private FreelancerRepo repo;
    @GetMapping("/getWalletAddress")
    public Map<String, String> getWalletAddress(@RequestParam int freelancerId) {
    Optional<Freelancer> freelancer = repo.findById(freelancerId);
    String wallet = freelancer.map(Freelancer::getWalletAddress).orElse("Wallet address not found");
    return Map.of("walletAddress", wallet);
    }

    @PostMapping("/newuser")
    boolean newuser(@RequestBody Freelancer freelancer){
        Freelancer f = repo.findUserByEmail(freelancer.email);
        if(f!=null) return false;

        repo.save(freelancer);
        return true;
    }

    @GetMapping("/checkuser")
    Freelancer checkuser(@RequestParam String email,@RequestParam String password){
        Freelancer f=repo.findUserByEmail(email);
        if(f==null) return null;

        if(f.password.equals(password)){
            return f;
        }
        return null;
    }
    
    
}
