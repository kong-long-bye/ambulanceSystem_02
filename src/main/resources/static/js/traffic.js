const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const map = ref(null);
        let geocoder = null;  // 地理编码服务
        const startPoint = ref('');
        const endPoint = ref('');
        const routeSteps = ref([]); // 存储导航步骤

        // 初始化地图
        const initMap = () => {
            console.log('初始化地图...');
            map.value = new AMap.Map('container', {
                zoom: 11,
                center: [106.504962, 29.533155], // 重庆市中心坐标
                resizeEnable: true,
                viewMode: '2D',
                lang: 'zh_cn'
            });

            map.value.addControl(new AMap.Scale());
            map.value.addControl(new AMap.ToolBar());

            // 初始化地理编码插件
            AMap.plugin(['AMap.Geocoder'], function() {
                geocoder = new AMap.Geocoder({
                    city: "重庆"
                });
            });
        };

        // 地址转换为经纬度
        const getLocation = (address) => {
            return new Promise((resolve, reject) => {
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.geocodes.length) {
                        resolve(result.geocodes[0].location);
                    } else {
                        reject('地址解析失败');
                    }
                });
            });
        };

        // 路线规划
        const planRoute = async () => {
            if (!startPoint.value || !endPoint.value) {
                alert('请输入起点和终点');
                return;
            }

            try {
                // 将地址转换为经纬度
                const startLoc = await getLocation(startPoint.value);
                const endLoc = await getLocation(endPoint.value);

                // 构建V5版本API请求URL
                const url = `https://restapi.amap.com/v5/direction/driving?` + 
                    `origin=${startLoc.lng},${startLoc.lat}&` +
                    `destination=${endLoc.lng},${endLoc.lat}&` +
                    `show_fields=cost,polyline,steps&` +
                    `key=33045d3facb58fc4cd6f27e6208ce059`;

                // 发送请求
                const response = await fetch(url);
                const result = await response.json();

                if (result.status === '1') {
                    // 清除之前的路线
                    map.value.clearMap();

                    // 获取第一条路线（最优路线）
                    const route = result.route.paths[0];
                    
                    // 保存导航步骤
                    routeSteps.value = route.steps;

                    // 解析路线坐标
                    const path = [];
                    route.steps.forEach(step => {
                        const polyline = step.polyline.split(';');
                        polyline.forEach(point => {
                            const [lng, lat] = point.split(',');
                            path.push([parseFloat(lng), parseFloat(lat)]);
                        });
                    });

                    // 绘制路线
                    const polyline = new AMap.Polyline({
                        path: path,
                        strokeColor: "#3366FF",
                        strokeWeight: 6,
                        strokeOpacity: 0.8,
                        showDir: true
                    });

                    // 添加起点和终点标记
                    const startMarker = new AMap.Marker({
                        position: path[0],
                        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png'
                    });
                    const endMarker = new AMap.Marker({
                        position: path[path.length - 1],
                        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
                    });

                    // 将路线和标记添加到地图
                    map.value.add([polyline, startMarker, endMarker]);
                    map.value.setFitView([polyline]);

                    // 在panel中显示导航步骤
                    const panel = document.getElementById('panel');
                    panel.innerHTML = `
                        <div class="route-info">
                            <h3>导航信息</h3>
                            <p>总距离：${(route.distance / 1000).toFixed(1)}公里</p>
                            <p>预计用时：${Math.ceil(route.duration / 60)}分钟</p>
                            ${route.taxi_cost ? `<p>预计打车费用：${route.taxi_cost}元</p>` : ''}
                        </div>
                        <div class="route-steps">
                            <h3>导航步骤</h3>
                            ${route.steps.map((step, index) => `
                                <div class="step">
                                    <span class="step-number">${index + 1}</span>
                                    <span class="step-instruction">${step.instruction}</span>
                                    <span class="step-distance">${step.step_distance}米</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    alert('路线规划失败：' + result.info);
                }
            } catch (error) {
                alert('路线规划失败：' + error);
            }
        };

        // 清除路线
        const clearRoute = () => {
            map.value.clearMap();
            const panel = document.getElementById('panel');
            panel.innerHTML = '';
            routeSteps.value = [];
        };

        onMounted(() => {
            console.log('组件挂载完成');
            setTimeout(() => {
                initMap();
            }, 100);
        });

        return {
            startPoint,
            endPoint,
            routeSteps,
            planRoute,
            clearRoute
        };
    }
});

app.mount('#app'); 