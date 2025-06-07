package com.Mapper;

import com.Entity.DTO.MedicineDTO;
import com.Entity.DTO.OrderDTO;
import com.Entity.Pojo.Medicine;
import com.Entity.VO.MedicineVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface MedicinesMapper {

    List<MedicineVO> getMedicines(MedicineDTO medicineDTO);

    Integer addMedicine(Medicine medicine);

    Integer updateMedicine(MedicineDTO medicineDTO);

    Integer deleteMedicine(String medicineId);

    @Select("select * from medicines where medicine_id=#{medicineId}")
    MedicineDTO getMedicineById(String medicineId);

    void order(Map<String,Object> map);
}
