package com.vulnerable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Test70WebApplication {
    
    @Autowired
    private UserRepository userRepository;
    
    public static void main(String[] args) {
        SpringApplication.run(Test70WebApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner dataInitializer() {
        return args -> {
            // Create test users
            userRepository.save(new User("admin", "admin@example.com"));
            userRepository.save(new User("john", "john@example.com"));
            userRepository.save(new User("jane", "jane@example.com"));
            userRepository.save(new User("bob", "bob@example.com"));
            userRepository.save(new User("alice", "alice@example.com"));
            
            System.out.println("Test data initialized successfully!");
        };
    }
} 