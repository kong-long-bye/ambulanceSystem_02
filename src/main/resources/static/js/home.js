// 全局变量定义
const API_BASE_URL = '/api/ambulances';

// 获取救护车列表
async function fetchAmbulances(status, plateNumber) {
    try {
        let url = API_BASE_URL;
        const params = new URLSearchParams();
        
        if (status) {
            params.append('status', status);
        }
        if (plateNumber) {
            params.append('plateNumber', plateNumber);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            alert(result.message);
            return [];
        }
    } catch (error) {
        console.error('获取救护车列表失败:', error);
        alert('获取数据失败');
        return [];
    }
}

// 更新救护车状态
async function updateAmbulanceStatus(ambulanceId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/${ambulanceId}/status?status=${status}`, {
            method: 'PUT'
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            alert('状态更新成功');
            // 刷新列表
            refreshAmbulanceList();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('更新状态失败:', error);
        alert('更新状态失败');
    }
}

// 刷新救护车列表
function refreshAmbulanceList() {
    const status = document.getElementById('statusFilter').value;
    const plateNumber = document.getElementById('plateNumberSearch').value;
    
    fetchAmbulances(status, plateNumber).then(ambulances => {
        const tableBody = document.getElementById('ambulanceTableBody');
        tableBody.innerHTML = '';
        
        ambulances.forEach(ambulance => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ambulance.ambulanceId}</td>
                <td><strong>${ambulance.plateNumber}</strong></td>
                <td>${getStatusBadge(ambulance.status)}</td>
                <td>
                    <div style="font-weight: 500;">${ambulance.driver?.name}</div>
                    <div style="color: #666; font-size: 13px;">${ambulance.driver?.phoneNumber}</div>
                </td>
                <td>
                    <button class="update-btn" 
                            onclick="showUpdateStatusDialog(${ambulance.ambulanceId}, '${ambulance.status}')">
                        更新状态
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
}

// 工具函数
function getStatusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

function formatDateTime(datetime) {
    if (!datetime) return '-';
    return new Date(datetime).toLocaleString();
}

function formatDriverInfo(driver) {
    if (!driver) return '-';
    return `${driver.name} (${driver.phoneNumber})`;
}

// 状态更新对话框
function showUpdateStatusDialog(ambulanceId, currentStatus) {
    const newStatus = prompt('请输入新状态 (执行任务中/待班中/维修中):', currentStatus);
    if (newStatus && ['执行任务中', '待班中', '维修中'].includes(newStatus)) {
        updateAmbulanceStatus(ambulanceId, newStatus);
    } else if (newStatus) {
        alert('无效的状态值');
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始加载列表
    refreshAmbulanceList();
    
    // 绑定搜索按钮事件
    document.getElementById('searchBtn').addEventListener('click', refreshAmbulanceList);
});
