package com.Controller;

import com.Common.Result;
import com.Entity.DTO.ScheduleDTO;
import com.Service.schedulesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@Slf4j
public class SchedulesController {

    @Autowired
    private schedulesService schedulesServiceImpl;

    /**
     * 查询排班
     * @param scheduleDTO
     * @return
     */
    @GetMapping
    public Result select(@RequestBody ScheduleDTO scheduleDTO) {
        log.info("查询排班,查询条件:scheduleDTO:{}", scheduleDTO);
        return schedulesServiceImpl.getSchedules(scheduleDTO);
    }

    /**
     * 创建排班
     * @param scheduleDTO
     * @return
     */
    @PostMapping
    public Result insert(@RequestBody ScheduleDTO scheduleDTO) {
        log.info("创建排班,schedule:{}", scheduleDTO);
        return schedulesServiceImpl.insertSchedules(scheduleDTO);
    }

    /**
     * 根据Id删除排班
     * @param scheduleId
     * @return
     */
    @DeleteMapping("/{scheduleId}")
    public Result delete(@PathVariable String scheduleId) {
        log.info("删除排班,schedule:{}", scheduleId);
        return schedulesServiceImpl.deleteSchedules(scheduleId);
    }

    /**
     * 根据Id删除排班
     * @param scheduleId
     * @param scheduleDTO
     * @return
     */
    @PostMapping("/{scheduleId}")
    public Result update(@PathVariable String scheduleId, @RequestBody ScheduleDTO scheduleDTO) {
        log.info("更新排班,更新排班ID为:{},更新信息为schedule:{}",scheduleId, scheduleDTO);
        return schedulesServiceImpl.updateSchedules(scheduleId,scheduleDTO);
    }
}
