import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import AxiosInstance from "../components/AxiosInstance";

function Dashboard() {
    const [chartData, setChartData] = useState([]);
    const [chartLabel, setChartLabel] = useState([]);
    const [Data, setData] = useState([]);
    let chartStatus = useRef();

    const [vendorCupListChart, setVendorCupListChart] = useState([]);
    let vendorCupListRef = useRef(null);
    let DashboardDetails = useRef({});

    function loadData() {
        // axios
        //     .post(
        //         `http://127.0.0.1:8000/chart/load-data`
        //     )
        AxiosInstance({
            method: "post",
            url: "/dashboard/load-pie-chart",
        })
            .then(function (response) {
                setChartData(response.data.product_list);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        loadData();
        dashboardData();
        VendorBalance();
        loadVendorData();
        const ctx = document.getElementById("myChart").getContext("2d");
        chartStatus.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: [],
                datasets: [
                    {
                        label: [],
                        data: [],
                        backgroundColor: [
                            "rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
                            "rgb(255, 205, 86)",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
        });
    }, []);

    useEffect(() => {
        chartDetail();
    }, [chartData]);

    useEffect(() => {
        pieChart();
    }, [Data]);

    function chartDetail() {
        let label = [];
        let data = [];
        chartData.forEach((product) => {
            label.push(product["name"]);
            data.push(Number(product["cups"]));
        });
        setChartLabel(label);
        setData(data);
    }
    function pieChart() {
        chartStatus.current.data.labels = chartLabel;
        chartStatus.current.data.datasets[0].data = Data;
        chartStatus.current.update();
    }

    useEffect(() => {
        setCupListData();
    }, [vendorCupListChart]);

    const setCupListData = () => {
        vendorCupListRef.current.data.labels = vendorCupListChart.label;
        vendorCupListChart.chartLabel != undefined &&
            (vendorCupListRef.current.data.datasets[0].label = `${vendorCupListChart.chartLabel} CupList`);
        vendorCupListRef.current.data.datasets[0].data =
            vendorCupListChart.data;
        vendorCupListRef.current.update();
    };

    const dashboardData = async () => {
        await AxiosInstance({
            method: "get",
            url: "/dashboard/load-dashboard-data",
        })
            .then(async function (response) {
                DashboardDetails.current = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const loadVendorData = async () => {
        await AxiosInstance({
            method: "get",
            url: "/dashboard/load-vendor-data",
        })
            .then(async function (response) {
                await setVendorCupListChart(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    function VendorBalance() {
        const VendorCupList = document
            .getElementById("VendorCupList")
            .getContext("2d");

        vendorCupListRef.current = new Chart(VendorCupList, {
            type: "bar",
            data: {
                datasets: [
                    {
                        label: "CupList",
                        data: [],
                        borderWidth: 1,
                    },
                ],
            },
            options: {},
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        });
    }

    return (
        <>
            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card mb-4">
                        <div className="btn btn-outline-primary d-flex justify-content-between align-items-center p-4 card-body">
                            <h3 className="m-0 p-0">Vendors :</h3>
                            <h3 className="m-0 p-0">
                                {DashboardDetails.current.totalVendors ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card">
                        <div className="btn btn-outline-primary d-flex justify-content-between align-items-center p-4 card-body">
                            <h3 className="m-0 p-0">This Month Expense :</h3>
                            <h3 className="m-0 p-0">
                                {DashboardDetails.current.thisMonthExpense ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card">
                        <div className="btn btn-outline-primary d-flex justify-content-between align-items-center p-4 card-body">
                            <h3 className="m-0 p-0">Last Month Expense :</h3>
                            <h3 className="m-0 p-0">
                                {DashboardDetails.current.lastMonthExpense ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card">
                        <div className="btn btn-outline-primary d-flex justify-content-between align-items-center p-4 card-body">
                            <h3 className="m-0 p-0">Last Payment :</h3>
                            <h3 className="m-0 p-0">
                                {DashboardDetails.current.lastPayment ?? 0}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-chart-area me-1"></i>
                            Cup Count
                        </div>
                        <div className="card-body">
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-xl-9">
                    <div className="card mb-4">
                        <div className="card-header">
                            <i className="fas fa-chart-bar me-1"></i>
                            Vendor Daily CupList
                        </div>
                        <div className="card-body">
                            <canvas id="VendorCupList" height={90}></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </>
    );
}

export default Dashboard;
