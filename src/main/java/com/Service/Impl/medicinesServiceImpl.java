package com.Service.Impl;


import com.Common.Result;
import com.Entity.DTO.CountDTO;
import com.Entity.DTO.MedicineDTO;
import com.Entity.DTO.OrderDTO;
import com.Entity.Pojo.Medicine;
import com.Entity.VO.MedicineVO;
import com.Mapper.MedicinesMapper;
import com.Service.medicinesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.Common.ComMedicine.*;

@Service
@Slf4j
public class medicinesServiceImpl implements medicinesService {

    @Autowired
    public MedicinesMapper MedicinesMapper;
    @Autowired
    private MedicinesMapper medicinesMapper;

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

    @Override
    public Result orderMedicines(OrderDTO orderDTO){
        Result result = new Result();
        Map<String, Object> params = new HashMap<>();
        params.put("medicineId", orderDTO.getMedicineId());
        params.put("quantity", orderDTO.getQuantity());
        params.put("success", orderDTO.getSuccess());
        MedicinesMapper.order(params);
        if((Integer)params.get("success") == 1){
            log.info("扣减库存成功,{}:",orderDTO);
            result.setCode(1);
            result.setMsg("扣减库存成功");
            result.setData(orderDTO);
        }else{
            log.info("扣减库存失败,{}:",params.get("success"));
            result.setCode(0);
            result.setMsg("扣减库存失败");
            result.setData(orderDTO);
        }
        return result;
    }

    @Override
    public Result count() {
        Result result = new Result();
        Integer i = medicinesMapper.count();
        CountDTO countDTO = new CountDTO();
        countDTO.setCount(i);
        result.setCode(1);
        result.setMsg("统计告急药品数量完成");
        result.setData(countDTO);
        return result;
    }
}
