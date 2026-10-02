package com.example.Recuriment.candidate.repository;

import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.candidate.entity.Candidate;
import com.example.Recuriment.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {

    Optional<Candidate> findByUserId(Long userId);

    Optional<Candidate> findByIdAndUserId(
            Long id,
            Long userId
    );
}
