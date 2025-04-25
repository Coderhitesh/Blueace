
import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const UserVerifyOtp = () => {
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const [userId, setUserId] = useState("")
    const {id} = useParams()

    useEffect(() => {
        if (id) {
            setUserId(id)
        }

        // Initialize timer for resend button
        setTimer(60)
    }, [])

    useEffect(() => {
        let interval
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleChange = (e) => {
        const value = e.target.value
        // Only allow numbers and limit to 6 digits
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP")
            return
        }

        setLoading(true)
        try {
            const res = await axios.post(`https://www.api.blueaceindia.com/api/v1/verify_user_otp/${userId}`, {
                loginOtp: otp,
            })

            sessionStorage.setItem("token", res.data.token)
            sessionStorage.setItem("user", JSON.stringify(res.data.user))

            if (res.data.success) {
                setOtp("")
                toast.success("Verification successful!")
                window.location.href = "/"
            }
        } catch (error) {
            console.log("Error verifying OTP:", error)
            toast.error(error.response?.data?.message || "Failed to verify OTP")
        } finally {
            setLoading(false)
        }
    }
    console.log("userId",userId)
    const handleResendOtp = async () => {
        if (timer > 0) return

        setResendLoading(true)
        try {
            const res = await axios.post(`https://www.api.blueaceindia.com/api/v1/resend_verify_user_otp/${userId}`)

            if (res.data.success) {
                toast.success("OTP resent successfully!")
                setTimer(60) // Reset timer to 60 seconds
            }
        } catch (error) {
            console.log("Error resending OTP:", error)
            toast.error(error.response?.data?.message || "Failed to resend OTP")
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-lg" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="card-header bg-primary text-white text-center py-3">
                    <h4 className="mb-0">Verify Your Account</h4>
                </div>

                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <div className="mb-3">
                            <i className="fas fa-shield-alt text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <p className="mb-1">Enter the 6-digit code sent to your phone</p>
                        <p className="text-muted small">The code is valid for 10 minutes</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="otp" className="form-label">
                                Verification Code
                            </label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg text-center"
                                    id="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || otp.length !== 6}>
                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card-footer bg-light p-3 text-center">
                    <p className="mb-0">
                        Didn't receive the code?
                        <button className="btn btn-link p-0 ms-1" onClick={handleResendOtp} disabled={timer > 0 || resendLoading}>
                            {resendLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Resending...
                                </span>
                            ) : timer > 0 ? (
                                `Resend in ${timer}s`
                            ) : (
                                "Resend OTP"
                            )}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserVerifyOtp
