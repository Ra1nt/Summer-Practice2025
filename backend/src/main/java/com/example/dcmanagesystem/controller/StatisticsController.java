package com.example.dcmanagesystem.controller;

import com.example.dcmanagesystem.dto.AreaYearAggDTO;
import com.example.dcmanagesystem.dto.IndustryYearAggDTO;
import com.example.dcmanagesystem.dto.ViolateRecordDTO;
import com.example.dcmanagesystem.dto.areaViolateRecordDTO;
import com.example.dcmanagesystem.service.StatisticsService;
import com.example.dcmanagesystem.bean.Response;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/stats")
public class StatisticsController {

    @Resource
    private StatisticsService statisticsService;

    /** 列表：按行业 + 年份 */
    @GetMapping("/industry-year/list")
    public Response listByIndustryYear(@RequestParam(required = false) String industry,
                                       @RequestParam(required = false) Integer year,
                                       @RequestParam(required = false, defaultValue = "1") Integer pageNum,
                                       @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        try {
            PageHelper.startPage(pageNum, pageSize);
            List<ViolateRecordDTO> list = statisticsService.listByIndustryYear(industry, year);
            return new Response(200, "success", new PageInfo<>(list));
        } catch (Exception e) {
            return new Response(502, "错误:" + e.getMessage());
        }
    }

    /** 聚合：按行业 + 年份 */
    @GetMapping("/industry-year/summary")
    public Response aggByIndustryYear(@RequestParam(required = false) String industry,
                                      @RequestParam(required = false) Integer year) {
        try {
            List<IndustryYearAggDTO> list = statisticsService.aggByIndustryYear(industry, year);
            return new Response(200, "success", list);
        } catch (Exception e) {
            return new Response(502, "错误:" + e.getMessage());
        }
    }

    @GetMapping("/area-year/list")
    public Response listByAreaYear(@RequestParam(required = false) String area,
                                       @RequestParam(required = false) Integer year,
                                       @RequestParam(required = false, defaultValue = "1") Integer pageNum,
                                       @RequestParam(required = false, defaultValue = "20") Integer pageSize) {
        try {
            PageHelper.startPage(pageNum, pageSize);
            List<areaViolateRecordDTO> list = statisticsService.listByAreaYear(area, year);
            return new Response(200, "success", new PageInfo<>(list));
        } catch (Exception e) {
            return new Response(502, "错误:" + e.getMessage());
        }
    }

    /** 聚合：按地区 + 年份 */
    @GetMapping("/area-year/summary")
    public Response aggByAreaYear(@RequestParam(required = false) String area,
                                      @RequestParam(required = false) Integer year) {
        try {
            List<AreaYearAggDTO> list = statisticsService.aggByAreaYear(area, year);
            return new Response(200, "success", list);
        } catch (Exception e) {
            return new Response(502, "错误:" + e.getMessage());
        }
    }
}
