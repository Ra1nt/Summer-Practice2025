package com.example.dcmanagesystem.service.impl;

import com.example.dcmanagesystem.dto.IndustryYearAggDTO;
import com.example.dcmanagesystem.dto.ViolateRecordDTO;
import com.example.dcmanagesystem.mapper.StatisticsMapper;
import com.example.dcmanagesystem.service.StatisticsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Resource
    private StatisticsMapper statisticsMapper;

    @Override
    public List<ViolateRecordDTO> listByIndustryYear(String industry, Integer year) {
        return statisticsMapper.selectViolateRecordsByIndustryYear(industry, year);
    }

    @Override
    public List<IndustryYearAggDTO> aggByIndustryYear(String industry, Integer year) {
        return statisticsMapper.selectIndustryYearAgg(industry, year);
    }
}
