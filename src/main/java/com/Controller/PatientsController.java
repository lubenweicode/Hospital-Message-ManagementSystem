package com.Controller;

import com.Common.Result;
import com.Entity.DTO.PatientDTO;
import com.Service.patientsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@Slf4j
public class PatientsController {

    @Autowired
    private patientsService patientsServiceImpl;

    /**
     * 查询患者信息(允许条件查询)
     * @param patientDTO
     * @return
     */
    @PostMapping("/search")
    public Result getPatients(@RequestBody(required = false) PatientDTO patientDTO) {
        log.info("查询患者信息,{}", patientDTO);
        return patientsServiceImpl.getPatients(patientDTO);
    }

    /**
     * 增加患者信息
     * @param patientDTO
     * @return
     */
    @PostMapping
    public Result addPatient(@RequestBody PatientDTO patientDTO) {
        log.info("增加患者信息：,{}", patientDTO);
        return patientsServiceImpl.addPatient(patientDTO);
    }

    /**
     * 根据Id删除患者信息
     * 删除患者信息
     * @param patientId
     * @return
     */
    @DeleteMapping("/{patientId}")
    public Result deletePatient(@PathVariable String patientId) {
        log.info("根据Id:{} 删除患者信息", patientId);
        return patientsServiceImpl.deletePatient(patientId);
    }

    /**
     * 根据Id更新患者信息
     * @param patientId
     * @param patientDTO
     * @return
     */
    @PutMapping("/{patientId}")
    public Result updatePatient(@PathVariable String patientId,@RequestBody PatientDTO patientDTO) {
        log.info("根据Id:{} 更新患者信息,{}", patientId,patientDTO);
        return patientsServiceImpl.updatePatient(patientId,patientDTO);
    }

    /**
     * 根据Id查询患者
     * @param patientId
     * @return
     */
    @GetMapping("/{patientId}")
    public Result getPatient(@PathVariable String patientId) {
        log.info("根据Id:{},查询患者信息", patientId);
        return patientsServiceImpl.getPatientsById(patientId);
    }
}
