package com.example.transitops.config;

import com.example.transitops.auth.entity.Role;
import com.example.transitops.auth.entity.User;
import com.example.transitops.auth.repository.RoleRepository;
import com.example.transitops.auth.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<String> roles = List.of(
                "ROLE_FLEET_MANAGER",
                "ROLE_DRIVER",
                "ROLE_SAFETY_OFFICER",
                "ROLE_FINANCIAL_ANALYST"
        );

        for (String roleName : roles) {
            if (roleRepository.findByRoleName(roleName).isEmpty()) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
            }
        }

        // Seed default Fleet Manager user
        String defaultEmail = "fleet.manager@transitops.com";
        if (userRepository.findByEmail(defaultEmail).isEmpty()) {
            Role fleetManagerRole = roleRepository.findByRoleName("ROLE_FLEET_MANAGER")
                    .orElseThrow(() -> new IllegalStateException("ROLE_FLEET_MANAGER not found"));

            User defaultUser = new User();
            defaultUser.setName("Fleet Manager");
            defaultUser.setEmail(defaultEmail);
            defaultUser.setPassword(passwordEncoder.encode("fleet123"));
            defaultUser.setEnabled(true);
            defaultUser.setRole(fleetManagerRole);
            userRepository.save(defaultUser);
        }

        // Seed default Driver user
        String driverEmail = "driver@transitops.com";
        if (userRepository.findByEmail(driverEmail).isEmpty()) {
            Role driverRole = roleRepository.findByRoleName("ROLE_DRIVER")
                    .orElseThrow(() -> new IllegalStateException("ROLE_DRIVER not found"));

            User driver = new User();
            driver.setName("John Driver");
            driver.setEmail(driverEmail);
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setEnabled(true);
            driver.setRole(driverRole);
            userRepository.save(driver);
        }

        // Seed default Safety Officer user
        String safetyEmail = "safety@transitops.com";
        if (userRepository.findByEmail(safetyEmail).isEmpty()) {
            Role safetyRole = roleRepository.findByRoleName("ROLE_SAFETY_OFFICER")
                    .orElseThrow(() -> new IllegalStateException("ROLE_SAFETY_OFFICER not found"));

            User safety = new User();
            safety.setName("Safety Officer");
            safety.setEmail(safetyEmail);
            safety.setPassword(passwordEncoder.encode("safety123"));
            safety.setEnabled(true);
            safety.setRole(safetyRole);
            userRepository.save(safety);
        }

        // Seed default Financial Analyst user
        String financeEmail = "finance@transitops.com";
        if (userRepository.findByEmail(financeEmail).isEmpty()) {
            Role financeRole = roleRepository.findByRoleName("ROLE_FINANCIAL_ANALYST")
                    .orElseThrow(() -> new IllegalStateException("ROLE_FINANCIAL_ANALYST not found"));

            User finance = new User();
            finance.setName("Financial Analyst");
            finance.setEmail(financeEmail);
            finance.setPassword(passwordEncoder.encode("finance123"));
            finance.setEnabled(true);
            finance.setRole(financeRole);
            userRepository.save(finance);
        }
    }
}
