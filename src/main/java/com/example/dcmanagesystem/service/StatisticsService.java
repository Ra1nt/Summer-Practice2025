package com.example.dcmanagesystem.service;

import com.example.dcmanagesystem.dto.IndustryYearAggDTO;
import com.example.dcmanagesystem.dto.ViolateRecordDTO;

import java.util.List;

public interface StatisticsService {
    List<ViolateRecordDTO> listByIndustryYear(String industry, Integer year);
    List<IndustryYearAggDTO> aggByIndustryYear(String industry, Integer year);
}
