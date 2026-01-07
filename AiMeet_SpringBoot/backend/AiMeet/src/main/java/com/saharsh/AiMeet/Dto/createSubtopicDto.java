package com.saharsh.AiMeet.Dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.saharsh.AiMeet.models.Topic;
import jakarta.persistence.*;

import java.time.LocalDateTime;

public class createSubtopicDto {

    private String name;
    private String aiSummary;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String title;
    private int hostid;

}
