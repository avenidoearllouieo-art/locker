import apiClient from './apiClient';

const normalizeStatus = (status) => {
  const raw = String(status ?? '').trim().toLowerCase();

  if (['available', 'free', 'vacant', 'open'].includes(raw)) {
    return 'Available';
  }

  if (['occupied', 'in use', 'rented', 'taken', 'in_use'].includes(raw)) {
    return 'In Use';
  }

  if (['expired', 'expired rental'].includes(raw)) {
    return 'Expired';
  }

  return status ? String(status).trim() : 'Available';
};

const parseRentalHours = (value) => {
  const hours = Number(value);
  return Number.isFinite(hours) && hours > 0 ? hours : 0;
};

const mapLocker = (locker) => ({
  id: locker.id,
  number: locker.locker_number ?? locker.number ?? locker.id,
  status: normalizeStatus(locker.status ?? locker.state ?? ''),
  owner: locker.rented_by ?? locker.owner ?? null,
  time_left: parseRentalHours(locker.rental_hours) * 3600,
  rental_duration: parseRentalHours(locker.rental_hours) * 3600
});

/**
 * Fetch all lockers
 * @returns {Promise<Array>} List of lockers
 */
export const fetchLockers = async () => {
  try {
    const response = await apiClient.get('/lockers/');
    let data = response.data;

    if (!Array.isArray(data) && data.lockers && Array.isArray(data.lockers)) {
      data = data.lockers;
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from API');
    }

    return data.map(mapLocker);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('Access denied. You do not have permission to view lockers.');
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      throw new Error(error.response.data.detail || error.response.data.error || 'Failed to fetch lockers');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw new Error(error.message || 'Failed to fetch lockers');
  }
};

/**
 * Rent a locker
 * @param {number} lockerId - Locker ID
 * @param {number} rentalDuration - Rental duration in seconds
 * @returns {Promise<Object>} Rental confirmation with updated locker info
 */
export const rentLocker = async (lockerId, rentalDuration) => {
  try {
    const response = await apiClient.post(`/lockers/${lockerId}/rent/`, {
      rental_hours: Math.floor(rentalDuration / 3600), // Convert seconds to hours for backend
    });

    // Transform response data if it contains locker info
    if (response.data && response.data.id) {
      return mapLocker(response.data);
    }

    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('Access denied. You do not have permission to rent lockers.');
      } else if (error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Invalid rental request. Please check your input.');
        }
      } else if (error.response.status === 409) {
        throw new Error('Locker is already rented or unavailable.');
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response.data.detail || error.response.data.error || 'Failed to rent locker');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'Failed to rent locker');
    }
  }
};

/**
 * Release a locker (end rental)
 * @param {number} lockerId - Locker ID
 * @returns {Promise<Object>} Release confirmation
 */
export const releaseLocker = async (lockerId) => {
  try {
    const response = await apiClient.post(`/lockers/${lockerId}/release/`);

    // Transform response data if it contains locker info
    if (response.data && response.data.id) {
      return mapLocker(response.data);
    }

    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response.status === 403) {
        throw new Error('Access denied. You do not have permission to release lockers.');
      } else if (error.response.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error('Invalid release request. Please check your input.');
        }
      } else if (error.response.status === 409) {
        throw new Error('Cannot release locker. It may not be rented by you.');
      } else if (error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response.data.detail || error.response.data.error || 'Failed to release locker');
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'Failed to release locker');
    }
  }
};
