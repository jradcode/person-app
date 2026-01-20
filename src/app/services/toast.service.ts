import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signal to hold the message
  message = signal<string | null>(null);
  // Signal to handle the type (success or error)
  type = signal<'success' | 'error'>('success');

  show(msg: string, type: 'success' | 'error' = 'success') {
    this.message.set(msg);
    this.type.set(type);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.message.set(null);
    }, 3000);
  }
}