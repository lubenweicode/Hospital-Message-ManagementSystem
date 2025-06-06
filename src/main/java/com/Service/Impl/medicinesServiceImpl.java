package com.Service.Impl;


import com.Common.Result;
import com.Entity.DTO.MedicineDTO;
import com.Entity.Pojo.Medicine;
import com.Entity.VO.MedicineVO;
import com.Mapper.MedicinesMapper;
import com.Service.medicinesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.Common.MSG_OPERATION_FAILED;
import static com.Common.Common.MSG_OPERATION_SUCCESS;
import static com.Common.ComMedicine.*;

@Service
@Slf4j
public class medicinesServiceImpl implements medicinesService {

    @Autowired
    public MedicinesMapper MedicinesMapper;

    @Override
    public Result addMedicines(Medicine medicine) {
        Result result = new Result();
        Integer flag = MedicinesMapper.addMedicine(medicine);
        if(flag == 1){
            log.info(MSG_INSERT_MEDICINE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_MEDICINE_SUCCESS);
            result.setData(medicine);
        }else{
            log.info(MSG_INSERT_MEDICINE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_MEDICINE_FAILED);
            result.setData(medicine);
        }
        return result;
    }

    /**
     * 查询药品
     * @param medicineDTO
     * @return
     */
    @Override
    public Result getMedicines(MedicineDTO medicineDTO) {
        Result result = new Result();
        List<MedicineVO> medicineList = MedicinesMapper.getMedicines(medicineDTO);
        if(medicineList != null){
            log.info(MSG_SELECT_MEDICINE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_MEDICINE_SUCCESS);
            result.setData(medicineList);
        }else{
            log.info(MSG_SELECT_MEDICINE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_MEDICINE_FAILED);
            result.setData(medicineDTO);
        }
        return result;
    }

    @Override
    public Result deleteMedicines(String medicineId) {
        Result result = new Result();
        Integer flag = MedicinesMapper.deleteMedicine(medicineId);
        if(flag == 1){
            log.info(MSG_DELETE_MEDICINE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_DELETE_MEDICINE_SUCCESS);
            result.setData(medicineId);
        }else{
            log.info(MSG_DELETE_MEDICINE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_DELETE_MEDICINE_FAILED);
            result.setData(medicineId);
        }
        return result;
    }

    @Override
    public Result updateMedicines(String medicineId, MedicineDTO medicineDTO) {
        Result result = new Result();
        medicineDTO.setMedicineId(medicineId);
        Integer flag = MedicinesMapper.updateMedicine(medicineDTO);
        if(flag == 1){
            log.info(MSG_UPDATE_MEDICINE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_MEDICINE_SUCCESS);
            result.setData(medicineId);
        }else{
            log.info(MSG_UPDATE_MEDICINE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_MEDICINE_FAILED);
            result.setData(medicineId);
        }
        return result;
    }

    /**
     * 根据Id查询药品
     * @param medicineId
     * @return
     */
    @Override
    public Result getmedicineById(String medicineId) {
        Result result = new Result();
        MedicineDTO medicine = MedicinesMapper.getMedicineById(medicineId);
        if(medicine != null){
            log.info(MSG_SELECT_MEDICINE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_MEDICINE_SUCCESS);
            result.setData(medicine);
        }else{
            log.info(MSG_SELECT_MEDICINE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_MEDICINE_SUCCESS);
            result.setData(medicineId);
        }
        return result;
    }
}
