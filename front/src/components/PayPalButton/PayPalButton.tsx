import { createOrder } from "@/helpers/orders.helper";
import { IProductCart } from "@/interfaces/IProduct";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

function Message({ content }: any) {
  return <p>{content}</p>;
}

const PayPalButton: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [userToken, setUserToken] = useState<string>("");
  const [cart, setCart] = useState<IProductCart[]>([]);

  const [message, setMessage] = useState("");
  const Router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as IProductCart[];
    setCart(cartData);

    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");

    setUserId(userSession?.userData?.data?.userid || "");
    setUserToken(userSession?.userData?.token || "");
  }, []);

  const handlecreateOrder = async (): Promise<string> => {
    const totalAmount = localStorage.getItem("totalAmount") || "0";
    const amount = parseFloat(totalAmount).toFixed(2);
    const total = parseFloat(amount);

    try {
      const response = await fetch(`${apiURL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 0.1 }),
      });

      const orderId = await response.text();

      return orderId;
    } catch (error: any) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
      throw error;
    }
  };

  const handleApprove = async (data: any, actions: any) => {
    try {
      const response = await fetch(
        `${apiURL}/payments/capture-order/${data.orderID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const orderData = await response.json();
  
      const errorDetail = orderData?.details?.[0];
  
      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
      }
      
      const transaction = orderData.purchase_units[0].payments.captures[0];
  
      if (transaction.status === "COMPLETED") {
        const order = {
          userId,
          products: cart.map((item) => ({ id: String(item.id) })),
        };
  
        const createOrderResponse = await createOrder(order, userToken);
  
        console.log("Order created successfully:", createOrderResponse);
        
        // Guardar la respuesta en localStorage
        localStorage.setItem("Order", JSON.stringify(createOrderResponse));
  
        localStorage.removeItem("cart");
  
        Router.push("/tracking");
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  }

  return (
    <>
      <PayPalButtons
        style={{
          shape: "pill",
          layout: "vertical",
          color: "black",
          label: "pay",
        }}
        createOrder={handlecreateOrder}
        onApprove={handleApprove}
      />
      <Message content={message} />
    </>
  );
};

export default PayPalButton;
