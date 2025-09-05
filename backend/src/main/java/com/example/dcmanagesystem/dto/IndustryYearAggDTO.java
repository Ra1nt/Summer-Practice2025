package com.example.dcmanagesystem.dto;

import lombok.Data;

@Data
public class IndustryYearAggDTO {
    private String  industry;
    private Integer year;
    private Long    violateSubjects; // 当年发生违约的“唯一主体数”（distinct customer_id）
    private Long    recoverSubjects; // 当年完成重生的“唯一主体数”
    private Long    totalRecords;    // 违约记录条数
}
