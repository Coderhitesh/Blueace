import React, { useState, useRef, useEffect } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import moment from "moment";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Card, Pagination, Spinner } from "react-bootstrap";


const DownloadEmployeeInExcel = () => {
  const tableRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchVendorDetail();
  }, []);

  const fetchVendorDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api.blueaceindia.com/api/v1/all-vendor");
      const vendorsData = res.data.data.filter((item) => item.Role === "employ").reverse();
      setVendors(vendorsData);
    } catch (error) {
      console.error("An error occurred while fetching vendor data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = vendors.filter((item) => {
    if (!fromDate || !toDate) return true;
    return moment(item.createdAt).isBetween(fromDate, toDate, null, "[]");
  });

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4">
        <h3 className="text-center mb-4">Download Employee Data</h3>

        {/* Date Selectors */}
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <DownloadTableExcel filename="Vendor_Data" sheet="vendors" currentTableRef={tableRef.current}>
              <Button variant="success" className="w-100">Export to Excel</Button>
            </DownloadTableExcel>
          </Col>
        </Row>

        {/* Loader */}
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {/* Scrollable Table (X Direction) */}
        {!loading && (
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <Table striped bordered hover className="text-center" ref={tableRef}>
              <thead className="bg-primary text-black">
                <tr>
                  <th className=" text-black">Company Name</th>
                  <th className=" text-black">Owner Name</th>
                  <th className=" text-black">Email</th>
                  <th className=" text-black">Year Of Registration</th>
                  <th className=" text-black">Complete Address</th>
                  <th className=" text-black">Contact Number</th>
                  <th className=" text-black">PAN Number</th>
                  <th className=" text-black">Aadhar Number</th>
                  <th className=" text-black">Wallet Amount</th>
                  <th className=" text-black">Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((item, index) => (
                    <tr key={index}>
                      <td>{item.companyName}</td>
                      <td>{item.ownerName}</td>
                      <td>{item.Email}</td>
                      <td>{item.yearOfRegistration}</td>
                      <td>{`${item.HouseNo}, ${item.address}, ${item.PinCode}`}</td>
                      <td>{item.ContactNumber}</td>
                      <td>{item.panNo}</td>
                      <td>{item.adharNo}</td>
                      <td>{item.walletAmount}</td>
                      <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-danger">
                      No data available for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </Card>
    </Container>
  );
};

export default DownloadEmployeeInExcel
