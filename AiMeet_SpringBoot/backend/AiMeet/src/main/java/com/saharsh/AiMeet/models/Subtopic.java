package com.saharsh.AiMeet.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Subtopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String name;
    private int  hostid;

    private String aiSummary;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic parentTopic;

}