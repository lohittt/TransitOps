package com.example.transitops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TransitOpsApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransitOpsApplication.class, args);
    }
}
