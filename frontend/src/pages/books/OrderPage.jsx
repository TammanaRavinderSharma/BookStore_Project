import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
    const { currentUser} = useAuth()


    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser.email);
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error geting orders data</div>
    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
            {
                orders.length === 0 ? (<div>No orders found!</div>) : (<div >
                    {
                        orders.map((order, index) => (
                            <div key={order._id} className="border-b mb-4 pb-4 bg-white m-10 p-6 rounded-b-4xl max-w-xl ">
                                <p className='p-1 text-white w-10 rounded mb-1 bg-blue-800 '># {index + 1}</p>
                                <h2 className="font-bold">Order ID: {order._id}</h2>
                                <p className="text-black">Name: {order.name}</p>
                                <p className="text-black">Email: {order.email}</p>
                                <p className="text-black">Phone: {order.phone}</p>
                                <p className="text-black">Total Price: ${order.totalPrice}</p>
                                <h3 className="font-semibold mt-2">Address:</h3>
                                <p> {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                                <h3 className="font-semibold mt-2">Products Id:</h3>
                                <ul>
                                    {order.productIds.map((productId) => (
                                        <li key={productId} className='text-black'>{productId}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    }
                </div>)
            }
        </div>
    )
}

export default OrderPage