package com.Controller;

import com.Entity.Pojo.Medicine;
import com.Common.Result;
import com.Entity.DTO.MedicineDTO;
import com.Service.medicinesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/medicine")
public class MedicineController {

    @Autowired
    private medicinesService medicinesServiceImpl;

    /**
     * 查询药品(允许条件查询)
     * @param medicineDTO
     * @return
     */
    @PostMapping("/search")
    public Result getMedicines(@RequestBody(required = false) MedicineDTO medicineDTO){
        log.info("查询药品:{}",medicineDTO);
        return medicinesServiceImpl.getMedicines(medicineDTO);
    }

    /**
     * 添加药品
     * @param medicine
     * @return
     */
    @PostMapping
    public Result addMedicines(@RequestBody Medicine medicine){
        log.info("添加药品:{}",medicine);
        return medicinesServiceImpl.addMedicines(medicine);
    }

    /**
     * 根据Id更新药品
     * @param medicineId
     * @param medicineDTO
     * @return
     */
    @PutMapping("/{medicineId}")
    public Result updateMedicines(@PathVariable String medicineId,@RequestBody MedicineDTO medicineDTO){
        log.info("根据Id:{} 更新药品",medicineId);
        return medicinesServiceImpl.updateMedicines(medicineId,medicineDTO);
    }

    /**
     * 根据Id删除药品
     * @param medicineId
     * @return
     */
    @DeleteMapping("/{medicineId}")
    public Result deleteMedicines(@PathVariable String medicineId){
        log.info("根据Id:{} 删除药品",medicineId);
        return medicinesServiceImpl.deleteMedicines(medicineId);
    }

    /**
     * 根据Id查询药品
     * @param medicineId
     * @return
     */
    @GetMapping("/{medicineId}")
    public Result getMedicineById(@PathVariable String medicineId){
        log.info("根据Id:{} 查询药品",medicineId);
        return medicinesServiceImpl.getmedicineById(medicineId);
    }
}
