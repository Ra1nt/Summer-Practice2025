package com.example.dcmanagesystem.service;

import com.example.dcmanagesystem.dto.AreaYearAggDTO;
import com.example.dcmanagesystem.dto.IndustryYearAggDTO;
import com.example.dcmanagesystem.dto.ViolateRecordDTO;
import com.example.dcmanagesystem.dto.areaViolateRecordDTO;

import java.util.List;

public interface StatisticsService {
    List<ViolateRecordDTO> listByIndustryYear(String industry, Integer year);
    List<IndustryYearAggDTO> aggByIndustryYear(String industry, Integer year);

    List<areaViolateRecordDTO> listByAreaYear(String area, Integer year);

    List<AreaYearAggDTO> aggByAreaYear(String area, Integer year);
}
