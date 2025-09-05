package com.example.dcmanagesystem.mapper;

import com.example.dcmanagesystem.dto.IndustryYearAggDTO;
import com.example.dcmanagesystem.dto.ViolateRecordDTO;
import com.example.dcmanagesystem.dto.AreaYearAggDTO;
import com.example.dcmanagesystem.dto.areaViolateRecordDTO;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StatisticsMapper {

    List<ViolateRecordDTO> selectViolateRecordsByIndustryYear(
            @Param("industry") String industry,
            @Param("year") Integer year
    );

    List<IndustryYearAggDTO> selectIndustryYearAgg(
            @Param("industry") String industry, // 可空；为空则统计所有行业分组
            @Param("year") Integer year
    );

    List<areaViolateRecordDTO> selectViolateRecordsByAreaYear(
            @Param("area") String area,
            @Param("year") Integer year
    );

    List<AreaYearAggDTO> selectAreaYearAgg(
            @Param("area") String area,
            @Param("year") Integer year
    );

}
