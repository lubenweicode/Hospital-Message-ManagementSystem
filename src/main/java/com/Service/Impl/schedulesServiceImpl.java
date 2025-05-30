package com.Service.Impl;

import com.Common.Result;
import com.Mapper.SchedulesMapper;
import com.Entity.DTO.ScheduleDTO;
import com.Entity.Pojo.Schedule;
import com.Service.schedulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComUserAuth.MSG_OPERATION_FAILED;
import static com.Common.ComUserAuth.MSG_OPERATION_SUCCESS;

@Service
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
        List<Schedule> scheduleList= schedulesMapper.getSchedules(scheduleDTO);
        Result result = new Result();
        if(scheduleList!=null&&scheduleList.size()>0){
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(scheduleList);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
            result.setData(null);
        }

        return null;
    }

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */
    @Override
    public Result insertSchedules(ScheduleDTO scheduleDTO) {
        Integer flag = schedulesMapper.insertSchedules(scheduleDTO);
        Result result = new Result();
        if(flag>0){
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
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
        Integer flag = schedulesMapper.updateSchedules(scheduleDTO);
        Result result = new Result();
        if(flag>0){
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
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
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
        }
        return result;
    }
}
