package com.example.dcmanagesystem.dto;

import lombok.Data;

@Data
public class areaViolateRecordDTO {
    private Integer violateId;
    private Integer customerId;
    private String  customerName;   // 个体主体
    private String  industry;       // 行业
    private String  area;           // 区域
    private Integer violateLevel;
    private String  violateReason;
    private Integer status;         // 违约申请状态（你现有枚举）
    private String  applyDate;

    // 重生相关
    private String  recoverCertificateDate;
    private String  recoverCertificatePerson;

    public boolean getRecovered() {
        return recoverCertificateDate != null && !recoverCertificateDate.isEmpty();
    }
}
