package com.Service.Impl;


import com.Common.Result;
import com.Entity.DTO.MedicineDTO;
import com.Entity.Pojo.Medicine;
import com.Mapper.MedicinesMapper;
import com.Service.medicinesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.Common.MSG_OPERATION_FAILED;
import static com.Common.Common.MSG_OPERATION_SUCCESS;
import static com.Common.ComMedicine.*;

@Service
public class medicinesServiceImpl implements medicinesService {

    @Autowired
    public MedicinesMapper MedicinesMapper;

    @Override
    public Result addMedicines(Medicine medicine) {
        Result result = new Result();
        Integer flag = MedicinesMapper.addMedicine(medicine);
        if(flag == 1){
            result.setCode(1);
            result.setMsg(MSG_INSERT_MEDICINE_SUCCESS);
            result.setData(medicine);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_MEDICINE_FAILED);
            result.setData(medicine);
        }
        return result;
    }

    @Override
    public Result getMedicines(MedicineDTO medicineDTO) {
        Result result = new Result();
        List<Medicine> medicineList = MedicinesMapper.getMedicine(medicineDTO);
        if(medicineList != null){
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS );
            result.setData(medicineList);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
            result.setData(medicineDTO);
        }
        return result;
    }

    @Override
    public Result deleteMedicines(String medicineId) {
        Result result = new Result();
        Integer flag = MedicinesMapper.deleteMedicine(medicineId);
        if(flag == 1){
            result.setCode(1);
            result.setMsg(MSG_DELETE_MEDICINE_SUCCESS);
            result.setData(medicineId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_DELETE_MEDICINE_FAILED);
            result.setData(medicineId);
        }
        return result;
    }

    @Override
    public Result updateMedicines(String medicineId, MedicineDTO medicineDTO) {
        Result result = new Result();
        Integer flag = MedicinesMapper.updateMedicine(medicineId,medicineDTO);
        if(flag == 1){
            result.setCode(1);
            result.setMsg(MSG_UPDATE_MEDICINE_SUCCESS);
            result.setData(medicineId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_UPDATE_MEDICINE_FAILED);
            result.setData(medicineId);
        }
        return result;
    }
}
