package com.Mapper;

import com.Entity.DTO.MedicineDTO;
import com.Entity.Pojo.Medicine;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MedicinesMapper {

    public List<Medicine> getMedicine(MedicineDTO medicineDTO);

    public Integer addMedicine(Medicine medicine);

    public Integer updateMedicine(String medicineId,MedicineDTO medicineDTO);

    public Integer deleteMedicine(String medicineId);

    @Select("select * from medicines where medicine_id=#{medicineId}")
    Medicine getMedicineById(String medicineId);
}
