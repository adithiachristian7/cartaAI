import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function BlockchainPayment() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Smart contract configuration
  const CONTRACT_ADDRESS = '0x651675f8899019b81901c592191d075bbbfeeaa9';
  const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "memo",
          "type": "string"
        }
      ],
      "name": "pay",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  const SEPOLIA_CHAIN_ID = '0xaa36a7';
  const PAYMENT_AMOUNT = '0.001'; // ETH
  const MEMO = 'Bayar Paket Premium Undangan CartaAI';

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleString('id-ID');
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      addLog('MetaMask tidak ditemukan. Silakan install MetaMask extension.', 'error');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check if we're on Sepolia network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      if (chainId !== SEPOLIA_CHAIN_ID) {
        addLog('Silakan switch ke Sepolia Test Network di MetaMask', 'warning');
        // Try to switch to Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          // If network doesn't exist, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              }],
            });
          }
        }
      }

      setAccount(accounts[0]);
      setIsConnected(true);
      addLog(`Wallet terhubung: ${accounts[0]}`, 'success');
    } catch (error) {
      addLog(`Error connecting wallet: ${error.message}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const makePayment = async () => {
    if (!isConnected || !account) {
      addLog('Silakan hubungkan wallet terlebih dahulu', 'warning');
      return;
    }

    setIsProcessing(true);
    addLog('Memproses pembayaran...', 'info');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Parse payment amount
      const amount = ethers.parseEther(PAYMENT_AMOUNT);

      addLog(`Mengirim ${PAYMENT_AMOUNT} ETH ke smart contract...`, 'info');

      // Send transaction
      const tx = await contract.pay(MEMO, { value: amount });
      addLog(`Transaksi dikirim: ${tx.hash}`, 'success');
      addLog(`Alamat wallet: ${account}`, 'info');

      // Wait for confirmation
      addLog('Menunggu konfirmasi transaksi...', 'info');
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        addLog('Transaksi berhasil dikonfirmasi!', 'success');
        addLog(`Block number: ${receipt.blockNumber}`, 'info');
        addLog(`Gas used: ${receipt.gasUsed.toString()}`, 'info');
      } else {
        addLog('Transaksi gagal', 'error');
      }

    } catch (error) {
      addLog(`Error dalam pembayaran: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Connection Section */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Koneksi Wallet</h3>

        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-bold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <span className="material-symbols-outlined mr-2 animate-spin">refresh</span>
                Menghubungkan...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">wallet</span>
                Connect Wallet
              </span>
            )}
          </button>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wallet Terhubung</p>
                <p className="font-mono text-sm text-green-700 break-all">{account}</p>
              </div>
              <span className="material-symbols-outlined text-green-600">check_circle</span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-3">
          Pastikan Anda menggunakan Sepolia Test Network di MetaMask
        </p>
      </div>

      {/* Payment Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Pembayaran Blockchain</h3>

        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Jumlah:</span>
            <span className="font-bold text-xl text-blue-600">{PAYMENT_AMOUNT} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Memo:</span>
            <span className="text-sm text-gray-700">{MEMO}</span>
          </div>
        </div>

        <button
          onClick={makePayment}
          disabled={!isConnected || isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined mr-2 animate-spin">refresh</span>
              Memproses Pembayaran...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined mr-2">send</span>
              Bayar {PAYMENT_AMOUNT} ETH
            </span>
          )}
        </button>
      </div>

      {/* Transaction Logs */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Log Transaksi</h3>
          <button
            onClick={clearLogs}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear Logs
          </button>
        </div>

        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada log transaksi...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-2">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={`ml-2 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockchainPayment;
