package com.Service.Impl;

import com.Common.Result;
import com.Mapper.SchedulesMapper;
import com.Entity.DTO.ScheduleDTO;
import com.Entity.Pojo.Schedule;
import com.Service.schedulesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComScheduleAppointment.*;
import static com.Common.ComUserAuth.MSG_OPERATION_FAILED;
import static com.Common.ComUserAuth.MSG_OPERATION_SUCCESS;

@Service
@Slf4j
public class schedulesServiceImpl implements schedulesService {

    @Autowired
    private SchedulesMapper schedulesMapper;
    /**
     * 查询排班
     * @param scheduleDTO
     * @return
     */
    @Override
    public Result getSchedules(ScheduleDTO scheduleDTO) {
        List<ScheduleDTO> scheduleList= schedulesMapper.getSchedules(scheduleDTO);
        Result result = new Result();
        if(scheduleList!=null&& !scheduleList.isEmpty()){
            log.info(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setData(scheduleList);
        }else{
            log.info(MSG_SELECT_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_SCHEDULE_FAILED);
            result.setData(null);
        }

        return result;
    }

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */
    @Override
    public Result insertSchedules(ScheduleDTO scheduleDTO) {
        Integer flag = schedulesMapper.insertSchedule(scheduleDTO);
        Result result = new Result();
        if(flag>0){
            log.info(MSG_INSERT_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_SCHEDULE_SUCCESS);
        }else{
            log.info(MSG_INSERT_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_SCHEDULE_FAILED);
        }
        return result;
    }

    /**
     * 更新排班
     * @param scheduleDTO
     * @return
     */
    @Override
    public Result updateSchedules(String scheduleId,ScheduleDTO scheduleDTO) {
        Integer flag = schedulesMapper.updateSchedule(scheduleDTO);
        Result result = new Result();
        if(flag>0){
            log.info(MSG_UPDATE_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_SCHEDULE_SUCCESS);
        }else{
            log.info(MSG_UPDATE_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_SCHEDULE_FAILED);
        }
        return result;
    }

    /**
     * 删除排班
     * @param scheduleId
     * @return
     */
    @Override
    public Result deleteSchedules(String scheduleId) {
        Integer flag = schedulesMapper.deleteSchedules(scheduleId);
        Result result = new Result();
        if(flag>0){
            log.info(MSG_DELETE_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_DELETE_SCHEDULE_SUCCESS);
        }else{
            log.info(MSG_DELETE_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_DELETE_SCHEDULE_FAILED);
        }
        return result;
    }

    /**
     * 根据Id查询患者
     * @param scheduleId
     * @return
     */
    @Override
    public Result getscheduleById(String scheduleId) {
        Result result = new Result();
        ScheduleDTO schedule = schedulesMapper.getschedulesById(scheduleId);
        if(schedule!=null){
            log.info(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setData(schedule);
        }else{
            log.info(MSG_SELECT_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_SCHEDULE_FAILED);
            result.setData(null);
        }
        return result;
    }

    @Override
    public Result getscheduleByDoctorId(String doctorId) {
        Result result = new Result();
        List<ScheduleDTO> scheduleDTO = schedulesMapper.getschedulesByDoctorId(doctorId);
        if(scheduleDTO!=null){
            log.info(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_SCHEDULE_SUCCESS);
            result.setData(scheduleDTO);
        }else{
            log.info(MSG_SELECT_SCHEDULE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_SCHEDULE_FAILED);
            result.setData(null);
        }
        return result;
    }
}
