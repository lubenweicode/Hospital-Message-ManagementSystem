package com.Service;

import com.Common.Result;
import com.Entity.DTO.PatientDTO;
import org.springframework.stereotype.Service;

@Service
public interface patientsService {

    /**
     * 查询患者(允许条件查询)
     * @return
     */
    public Result getPatients(PatientDTO patientDTO);

    /**
     * 增加患者
     * @param patientDTO
     * @return
     */
    public Result addPatient(PatientDTO patientDTO);

    /**
     * 更新患者
     * @param patientId
     * @return
     */
    public Result updatePatient(String patientId,PatientDTO patientDTO);

    /**
     * 删除患者
     * @param patientId
     * @return
     */
    public Result deletePatient(String patientId);
}
