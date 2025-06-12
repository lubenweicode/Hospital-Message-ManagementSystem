package com.Controller;

import com.Common.Result;
import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import com.Service.doctorsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/doctors")
public class DoctorsController {

    @Autowired
    private doctorsService doctorsService;

    /**
     * 查询医生(允许条件查询)
     * @param DoctorDTO
     * @return
     */
    @PostMapping("/search")
    public Result getDoctors(@RequestBody(required = false) DoctorDTO DoctorDTO) {
        log.info("查询医生:{}", DoctorDTO);
        return doctorsService.getDoctors(DoctorDTO);
    }

    /**
     * 添加医生
     * @param doctor
     * @return
     */
    @PostMapping
    public Result addDoctor(@RequestBody Doctor doctor) {
        log.info("添加医生:{}", doctor);
        return doctorsService.addDoctor(doctor);
    }

    /**
     * 根据Id更新医生
     * @param doctorId
     * @param doctorDTO
     * @return
     */
    @PutMapping("/{doctorId}")
    public Result updateDoctor(@PathVariable String doctorId,@RequestBody DoctorDTO doctorDTO) {
        log.info("根据Id:{} 更新医生{}", doctorId, doctorDTO);
        return doctorsService.updateDoctor(doctorId,doctorDTO);
    }

    /**
     * 根据Id删除医生
     * @param doctorId
     * @return
     */
    @DeleteMapping("/{doctorId}")
    public Result deleteDoctor(@PathVariable String doctorId) {
        log.info("根据Id:{} 删除医生", doctorId);
        return doctorsService.deleteDoctor(doctorId);
    }

    /**
     * 根据Id查询医生
     * @param doctorId
     * @return
     */
    @GetMapping("/{doctorId}")
    public Result getDoctor(@PathVariable String doctorId) {
        log.info("根据Id:{} 查询医生",doctorId);
        return doctorsService.getDoctorById(doctorId);
    }

    /**
     * 统计在班医生数量
     * @return
     */
    @GetMapping("/count")
    public Result getDoctorCount() {
        log.info("统计在班医生数量");
        return doctorsService.count();
    }
}
