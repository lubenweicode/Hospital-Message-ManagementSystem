package com.Mapper;

import com.Entity.DTO.MedicineDTO;
import com.Entity.Pojo.Medicine;
import com.Entity.VO.MedicineVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MedicinesMapper {

    public List<MedicineVO> getMedicines(MedicineDTO medicineDTO);

    public Integer addMedicine(Medicine medicine);

    public Integer updateMedicine(MedicineDTO medicineDTO);

    public Integer deleteMedicine(String medicineId);

    @Select("select * from medicines where medicine_id=#{medicineId}")
    MedicineDTO getMedicineById(String medicineId);
}
